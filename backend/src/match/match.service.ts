import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Match, MatchStatus } from '@prisma/client';
import { CreateMatchDto, UpdateMatchDto } from './dtos/match.dto';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  async getMatches(
    tournamentId: string,
    status?: MatchStatus,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Record<string, Match[]>; meta: { total: number } }> {
    const skip = (page - 1) * limit;
    const tournament = await this.prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
    });

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with ID ${tournamentId} not found`,
      );
    }

    // Get total count for pagination
    const totalMatches = await this.prisma.match.count({
      where: {
        tournamentId,
        ...(status && { status }),
      },
    });

    const matches = await this.prisma.match.findMany({
      where: {
        tournamentId,
        ...(status && { status }),
      },
      orderBy: { date: 'desc' },
      include: {
        homeTeam: { select: { name: true, logo: true } },
        awayTeam: { select: { name: true, logo: true } },
      },
      skip,
      take: Number(limit),
    });

    // Group matches by date
    const groupedMatches = matches.reduce(
      (acc, match) => {
        const date = match.date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(match);
        return acc;
      },
      {} as Record<string, Match[]>,
    );

    return {
      data: groupedMatches,
      meta: {
        total: totalMatches,
      },
    };
  }

  async getTeamMatches(
    teamId: string,
    tournamentId?: string,
    status?: MatchStatus,
    limit: number = 5,
  ): Promise<Match[]> {
    // Validate teamId is provided
    if (!teamId) {
      throw new BadRequestException('Team ID is required');
    }

    // Ensure limit is a number
    const takeLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;

    // Query for matches where the team is either home or away
    return this.prisma.match.findMany({
      where: {
        ...(tournamentId && { tournamentId }),
        ...(status && { status }),
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
      orderBy: { date: 'desc' },
      include: {
        homeTeam: { select: { name: true, logo: true } },
        awayTeam: { select: { name: true, logo: true } },
        tournament: { select: { name: true } },
      },
      take: takeLimit,
    });
  }

  async getMatchById(id: string): Promise<Match> {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: true,
        goals: {
          include: {
            scorer: true,
          },
        },
      },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return match;
  }

  async createMatch(data: CreateMatchDto): Promise<Match> {
    // Check if tournament exists
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: data.tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with ID ${data.tournamentId} not found`,
      );
    }

    // Check if home team exists
    const homeTeam = await this.prisma.team.findUnique({
      where: { id: data.homeTeamId },
    });

    if (!homeTeam) {
      throw new NotFoundException(
        `Home team with ID ${data.homeTeamId} not found`,
      );
    }

    // Check if away team exists
    const awayTeam = await this.prisma.team.findUnique({
      where: { id: data.awayTeamId },
    });

    if (!awayTeam) {
      throw new NotFoundException(
        `Away team with ID ${data.awayTeamId} not found`,
      );
    }

    // Check that home and away teams are different
    if (data.homeTeamId === data.awayTeamId) {
      throw new BadRequestException(
        'Home team and away team cannot be the same',
      );
    }

    // Check that both teams belong to the specified tournament
    if (
      homeTeam.tournamentId !== data.tournamentId ||
      awayTeam.tournamentId !== data.tournamentId
    ) {
      throw new BadRequestException(
        'Both teams must belong to the specified tournament',
      );
    }

    return this.prisma.match.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: true,
      },
    });
  }

  async updateMatch(id: string, data: UpdateMatchDto): Promise<Match> {
    // Check if match exists
    await this.getMatchById(id);

    // If tournamentId is being updated, check if the tournament exists
    if (data.tournamentId) {
      const tournament = await this.prisma.tournament.findUnique({
        where: { id: data.tournamentId },
      });

      if (!tournament) {
        throw new NotFoundException(
          `Tournament with ID ${data.tournamentId} not found`,
        );
      }
    }

    // If homeTeamId is being updated, check if the home team exists
    if (data.homeTeamId) {
      const homeTeam = await this.prisma.team.findUnique({
        where: { id: data.homeTeamId },
      });

      if (!homeTeam) {
        throw new NotFoundException(
          `Home team with ID ${data.homeTeamId} not found`,
        );
      }
    }

    // If awayTeamId is being updated, check if the away team exists
    if (data.awayTeamId) {
      const awayTeam = await this.prisma.team.findUnique({
        where: { id: data.awayTeamId },
      });

      if (!awayTeam) {
        throw new NotFoundException(
          `Away team with ID ${data.awayTeamId} not found`,
        );
      }
    }

    // Check that home and away teams are different if both are being updated
    if (
      data.homeTeamId &&
      data.awayTeamId &&
      data.homeTeamId === data.awayTeamId
    ) {
      throw new BadRequestException(
        'Home team and away team cannot be the same',
      );
    }
    // Process date if provided
    const updateData: any = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }
    if (data.matchday) {
      updateData.matchday = parseInt(data.matchday as any, 10); // Ensure it's an integer
      if (isNaN(updateData.matchday)) {
        throw new BadRequestException('Matchday must be a valid integer');
      }
    }

    return this.prisma.match.update({
      where: { id },
      data: updateData,
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: true,
      },
    });
  }

  async deleteMatch(id: string): Promise<Match> {
    // Check if match exists
    await this.getMatchById(id);

    return this.prisma.match.delete({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: true,
      },
    });
  }
}

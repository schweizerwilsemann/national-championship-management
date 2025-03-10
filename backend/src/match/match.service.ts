import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Match, MatchStatus } from '@prisma/client';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  async getMatches(
    tournamentId: string,
    status?: MatchStatus,
    page: number = 1,
    limit: number = 10,
  ): Promise<Record<string, Match[]>> {
    const skip = (page - 1) * limit; // Calculate the number of records to skip

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

    return groupedMatches; // Return grouped matches
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
}

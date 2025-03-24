import { PrismaService } from '@/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Standing } from '@prisma/client';
import { CreateStandingDto, UpdateStandingDto } from './dtos/standing.dto';

@Injectable()
export class StandingService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentStanding(tournamentId: string): Promise<Standing[]> {
    return this.prisma.standing.findMany({
      where: { tournamentId },
      orderBy: { points: 'desc' },
      include: { team: { select: { name: true, logo: true } } }, // Joining table to display name
    });
  }

  async getAllStandings(): Promise<Standing[]> {
    return this.prisma.standing.findMany({
      include: { team: true },
      orderBy: { points: 'desc' },
    });
  }

  async getStandingById(id: string): Promise<Standing> {
    const standing = await this.prisma.standing.findUnique({
      where: { id },
      include: { team: true },
    });

    if (!standing) {
      throw new NotFoundException(`Standing with ID ${id} not found`);
    }

    return standing;
  }

  async getStandingByTeamAndTournament(
    teamId: string,
    tournamentId: string,
  ): Promise<Standing> {
    const standing = await this.prisma.standing.findFirst({
      where: {
        teamId,
        tournamentId,
      },
      include: { team: true },
    });

    if (!standing) {
      throw new NotFoundException(
        `Standing for team ${teamId} in tournament ${tournamentId} not found`,
      );
    }

    return standing;
  }

  async createStanding(data: CreateStandingDto): Promise<Standing> {
    // Check if tournament exists
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: data.tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with ID ${data.tournamentId} not found`,
      );
    }

    // Check if team exists
    const team = await this.prisma.team.findUnique({
      where: { id: data.teamId },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${data.teamId} not found`);
    }

    // Check if team belongs to the tournament
    if (team.tournamentId !== data.tournamentId) {
      throw new BadRequestException(
        `Team does not belong to the specified tournament`,
      );
    }

    // Check if standing already exists for this team in this tournament
    const existingStanding = await this.prisma.standing.findFirst({
      where: {
        teamId: data.teamId,
        tournamentId: data.tournamentId,
      },
    });

    if (existingStanding) {
      throw new BadRequestException(
        `Standing already exists for this team in this tournament`,
      );
    }

    // Calculate goal difference if not provided
    let goalDifference = data.goalDifference;
    if (
      goalDifference === undefined &&
      data.goalsFor !== undefined &&
      data.goalsAgainst !== undefined
    ) {
      goalDifference = data.goalsFor - data.goalsAgainst;
    }

    return this.prisma.standing.create({
      data: {
        ...data,
        goalDifference,
      },
      include: { team: true },
    });
  }

  async updateStanding(id: string, data: UpdateStandingDto): Promise<Standing> {
    // Check if standing exists
    await this.getStandingById(id);

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

    // If teamId is being updated, check if the team exists
    if (data.teamId) {
      const team = await this.prisma.team.findUnique({
        where: { id: data.teamId },
      });

      if (!team) {
        throw new NotFoundException(`Team with ID ${data.teamId} not found`);
      }

      // Check if team belongs to the tournament
      if (data.tournamentId && team.tournamentId !== data.tournamentId) {
        throw new BadRequestException(
          `Team does not belong to the specified tournament`,
        );
      }
    }

    // Calculate goal difference if goals changed but goal difference not provided
    let updateData: any = { ...data };
    if (
      updateData.goalDifference === undefined &&
      (updateData.goalsFor !== undefined ||
        updateData.goalsAgainst !== undefined)
    ) {
      const currentStanding = await this.getStandingById(id);
      const goalsFor =
        updateData.goalsFor !== undefined
          ? updateData.goalsFor
          : currentStanding.goalsFor;
      const goalsAgainst =
        updateData.goalsAgainst !== undefined
          ? updateData.goalsAgainst
          : currentStanding.goalsAgainst;
      updateData.goalDifference = goalsFor - goalsAgainst;
    }

    return this.prisma.standing.update({
      where: { id },
      data: updateData,
      include: { team: true },
    });
  }

  async deleteStanding(id: string): Promise<Standing> {
    // Check if standing exists
    await this.getStandingById(id);

    return this.prisma.standing.delete({
      where: { id },
      include: { team: true },
    });
  }

  async updateStandingAfterMatch(matchId: string): Promise<void> {
    // Get match details
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (
      !match ||
      match.status !== 'FINISHED' ||
      match.homeScore === null ||
      match.awayScore === null
    ) {
      throw new BadRequestException(
        'Match is not finished or scores are not available',
      );
    }

    // Get or create home team standing
    let homeStanding = await this.prisma.standing.findFirst({
      where: {
        teamId: match.homeTeamId,
        tournamentId: match.tournamentId,
      },
    });

    if (!homeStanding) {
      homeStanding = await this.prisma.standing.create({
        data: {
          position: 0,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
          form: '',
          teamId: match.homeTeamId,
          tournamentId: match.tournamentId,
        },
      });
    }

    // Get or create away team standing
    let awayStanding = await this.prisma.standing.findFirst({
      where: {
        teamId: match.awayTeamId,
        tournamentId: match.tournamentId,
      },
    });

    if (!awayStanding) {
      awayStanding = await this.prisma.standing.create({
        data: {
          position: 0,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
          form: '',
          teamId: match.awayTeamId,
          tournamentId: match.tournamentId,
        },
      });
    }

    // Update home team standing
    const homeWon = match.homeScore > match.awayScore ? 1 : 0;
    const homeLost = match.homeScore < match.awayScore ? 1 : 0;
    const homeDrawn = match.homeScore === match.awayScore ? 1 : 0;
    const homePoints = homeWon * 3 + homeDrawn * 1;
    const homeForm = this.updateForm(
      homeStanding.form || '',
      homeWon ? 'W' : homeLost ? 'L' : 'D',
    );

    await this.prisma.standing.update({
      where: { id: homeStanding.id },
      data: {
        played: homeStanding.played + 1,
        won: homeStanding.won + homeWon,
        drawn: homeStanding.drawn + homeDrawn,
        lost: homeStanding.lost + homeLost,
        goalsFor: homeStanding.goalsFor + match.homeScore,
        goalsAgainst: homeStanding.goalsAgainst + match.awayScore,
        goalDifference:
          homeStanding.goalsFor +
          match.homeScore -
          (homeStanding.goalsAgainst + match.awayScore),
        points: homeStanding.points + homePoints,
        form: homeForm,
      },
    });

    // Update away team standing
    const awayWon = match.awayScore > match.homeScore ? 1 : 0;
    const awayLost = match.awayScore < match.homeScore ? 1 : 0;
    const awayDrawn = match.awayScore === match.homeScore ? 1 : 0;
    const awayPoints = awayWon * 3 + awayDrawn * 1;
    const awayForm = this.updateForm(
      awayStanding.form || '',
      awayWon ? 'W' : awayLost ? 'L' : 'D',
    );

    await this.prisma.standing.update({
      where: { id: awayStanding.id },
      data: {
        played: awayStanding.played + 1,
        won: awayStanding.won + awayWon,
        drawn: awayStanding.drawn + awayDrawn,
        lost: awayStanding.lost + awayLost,
        goalsFor: awayStanding.goalsFor + match.awayScore,
        goalsAgainst: awayStanding.goalsAgainst + match.homeScore,
        goalDifference:
          awayStanding.goalsFor +
          match.awayScore -
          (awayStanding.goalsAgainst + match.homeScore),
        points: awayStanding.points + awayPoints,
        form: awayForm,
      },
    });

    // Update positions for all teams in the tournament
    await this.updatePositions(match.tournamentId);
  }

  private updateForm(currentForm: string, result: 'W' | 'D' | 'L'): string {
    // Keep only the last 5 results
    const formArray = currentForm ? currentForm.split('') : [];
    formArray.unshift(result); // Add new result at the beginning
    return formArray.slice(0, 5).join(''); // Keep only the last 5 results
  }

  private async updatePositions(tournamentId: string): Promise<void> {
    // Get all standings for the tournament, ordered by points (desc), goal difference (desc), goals for (desc)
    const standings = await this.prisma.standing.findMany({
      where: { tournamentId },
      orderBy: [
        { points: 'desc' },
        { goalDifference: 'desc' },
        { goalsFor: 'desc' },
      ],
    });

    // Update positions
    for (let i = 0; i < standings.length; i++) {
      await this.prisma.standing.update({
        where: { id: standings[i].id },
        data: { position: i + 1 },
      });
    }
  }
}

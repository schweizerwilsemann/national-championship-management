import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Goal } from '@prisma/client';
import { CreateGoalDto, UpdateGoalDto } from './dtos/goal.dto';

@Injectable()
export class GoalService {
  constructor(private readonly prisma: PrismaService) {}
  // In your goal.service.ts
  async getAllGoals(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ data: Goal[]; meta: { total: number } }> {
    // Get total count for pagination
    const totalGoals = await this.prisma.goal.count();

    const goals = await this.prisma.goal.findMany({
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
        scorer: {
          include: {
            team: true, // Include the team directly in the scorer relation
          },
        },
      },
    });

    return {
      data: goals,
      meta: {
        total: totalGoals,
      },
    };
  }

  async getGoalsByMatch(matchId: string): Promise<Goal[]> {
    // Check if match exists
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    return this.prisma.goal.findMany({
      where: { matchId },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
        scorer: true,
      },
      orderBy: { minute: 'asc' },
    });
  }

  async getGoalsByPlayer(playerId: string): Promise<Goal[]> {
    // Check if player exists
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    return this.prisma.goal.findMany({
      where: { scorerId: playerId },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
        scorer: true,
      },
    });
  }

  async getGoalById(id: string): Promise<Goal> {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
        scorer: true,
      },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return goal;
  }

  async createGoal(data: CreateGoalDto): Promise<Goal> {
    // Check if match exists
    const match = await this.prisma.match.findUnique({
      where: { id: data.matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${data.matchId} not found`);
    }

    // Check if player exists
    const player = await this.prisma.player.findUnique({
      where: { id: data.scorerId },
      include: { team: true },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${data.scorerId} not found`);
    }

    // Check if player belongs to one of the teams in the match
    if (
      player.teamId !== match.homeTeamId &&
      player.teamId !== match.awayTeamId
    ) {
      throw new BadRequestException(
        `Player does not belong to either team in this match`,
      );
    }

    // Create the goal
    const goal = await this.prisma.goal.create({
      data,
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
        scorer: true,
      },
    });

    // Update match score
    const isHomeTeamGoal = player.teamId === match.homeTeamId;
    const isOwnGoal = data.isOwnGoal || false;

    // For own goals, the goal counts for the opposing team
    const updateHomeScore =
      (isHomeTeamGoal && !isOwnGoal) || (!isHomeTeamGoal && isOwnGoal);
    const updateAwayScore =
      (!isHomeTeamGoal && !isOwnGoal) || (isHomeTeamGoal && isOwnGoal);

    await this.prisma.match.update({
      where: { id: data.matchId },
      data: {
        homeScore: updateHomeScore
          ? (match.homeScore || 0) + 1
          : match.homeScore,
        awayScore: updateAwayScore
          ? (match.awayScore || 0) + 1
          : match.awayScore,
      },
    });

    return goal;
  }

  async updateGoal(id: string, data: UpdateGoalDto): Promise<Goal> {
    // Check if goal exists
    const existingGoal = await this.getGoalById(id);

    // If matchId is being updated, check if the match exists
    if (data.matchId && data.matchId !== existingGoal.matchId) {
      const match = await this.prisma.match.findUnique({
        where: { id: data.matchId },
      });

      if (!match) {
        throw new NotFoundException(`Match with ID ${data.matchId} not found`);
      }
    }

    // If scorerId is being updated, check if the player exists
    if (data.scorerId && data.scorerId !== existingGoal.scorerId) {
      const player = await this.prisma.player.findUnique({
        where: { id: data.scorerId },
      });

      if (!player) {
        throw new NotFoundException(
          `Player with ID ${data.scorerId} not found`,
        );
      }

      // Check if player belongs to one of the teams in the match
      const matchId = data.matchId || existingGoal.matchId;
      const match = await this.prisma.match.findUnique({
        where: { id: matchId },
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      });

      if (!match) {
        throw new NotFoundException(`Match with ID ${matchId} not found`);
      }

      if (
        player.teamId !== match.homeTeamId &&
        player.teamId !== match.awayTeamId
      ) {
        throw new BadRequestException(
          `Player does not belong to either team in this match`,
        );
      }
    }

    return this.prisma.goal.update({
      where: { id },
      data,
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
        scorer: true,
      },
    });
  }

  async deleteGoal(id: string): Promise<Goal> {
    // Check if goal exists
    const goal = await this.getGoalById(id);

    // Get match details to update score
    const match = await this.prisma.match.findUnique({
      where: { id: goal.matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${goal.matchId} not found`);
    }

    // Get player details to determine which team scored
    const player = await this.prisma.player.findUnique({
      where: { id: goal.scorerId },
      include: { team: true },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${goal.scorerId} not found`);
    }

    // Update match score
    const isHomeTeamGoal = player.teamId === match.homeTeamId;
    const isOwnGoal = goal.isOwnGoal || false;

    // For own goals, the goal counts for the opposing team
    const updateHomeScore =
      (isHomeTeamGoal && !isOwnGoal) || (!isHomeTeamGoal && isOwnGoal);
    const updateAwayScore =
      (!isHomeTeamGoal && !isOwnGoal) || (isHomeTeamGoal && isOwnGoal);

    await this.prisma.match.update({
      where: { id: goal.matchId },
      data: {
        homeScore:
          updateHomeScore && match.homeScore
            ? match.homeScore - 1
            : match.homeScore,
        awayScore:
          updateAwayScore && match.awayScore
            ? match.awayScore - 1
            : match.awayScore,
      },
    });

    return this.prisma.goal.delete({
      where: { id },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
        scorer: true,
      },
    });
  }
}

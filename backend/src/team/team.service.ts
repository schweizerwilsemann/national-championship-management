import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Team } from '@prisma/client';
import { CreateTeamDto, UpdateTeamDto } from './dtos/team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllTeams(): Promise<Team[]> {
    return this.prisma.team.findMany({
      include: { tournament: true },
      orderBy: { name: 'asc' },
    });
  }

  async getTeamsByTournament(tournamentId: string): Promise<Team[]> {
    return this.prisma.team.findMany({
      where: { tournamentId },
      include: { tournament: true },
      orderBy: { name: 'asc' },
    });
  }

  async getTeamPlayers(teamId: string) {
    // Check if team exists
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    // Get all players for this team
    const players = await this.prisma.player.findMany({
      where: { teamId },
      orderBy: [
        { position: 'asc' },
        { number: 'asc' }
      ],
    });

    return players;
  }

  async getTeamById(id: string, includePlayers = false): Promise<Team> {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        tournament: true,
        ...(includePlayers ? { players: true } : {})
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async createTeam(data: CreateTeamDto): Promise<Team> {
    // Check if tournament exists
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: data.tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with ID ${data.tournamentId} not found`,
      );
    }

    // Check if team name is unique within the tournament
    const existingTeam = await this.prisma.team.findFirst({
      where: {
        name: data.name,
        tournamentId: data.tournamentId,
      },
    });

    if (existingTeam) {
      throw new Error(
        `Team with name ${data.name} already exists in this tournament`,
      );
    }

    return this.prisma.team.create({
      data,
      include: { tournament: true },
    });
  }

  async updateTeam(id: string, data: UpdateTeamDto): Promise<Team> {
    // Check if team exists
    await this.getTeamById(id);

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

      // Check if team name is unique within the new tournament
      if (data.name) {
        const existingTeam = await this.prisma.team.findFirst({
          where: {
            name: data.name,
            tournamentId: data.tournamentId,
            id: { not: id }, // Exclude current team
          },
        });

        if (existingTeam) {
          throw new Error(
            `Team with name ${data.name} already exists in this tournament`,
          );
        }
      }
    }

    return this.prisma.team.update({
      where: { id },
      data,
      include: { tournament: true },
    });
  }

  async deleteTeam(id: string): Promise<Team> {
    // Check if team exists
    await this.getTeamById(id);

    return this.prisma.team.delete({
      where: { id },
      include: { tournament: true },
    });
  }
}

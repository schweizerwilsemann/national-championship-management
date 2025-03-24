import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Player, Prisma } from '@prisma/client';
import { CreatePlayerDto, UpdatePlayerDto } from './dtos/player.dto';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlayersPagination(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ data: Player[]; meta: { total: number } }> {
    // Get total count for pagination
    const totalPlayers = await this.prisma.player.count();

    const players = await this.prisma.player.findMany({
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
      include: { team: true },
    });

    return {
      data: players,
      meta: {
        total: totalPlayers,
      },
    };
  }

  async getAllPlayers(
    name?: string,
    teamId?: string,
    nationality?: string,
    isActive?: boolean,
  ): Promise<Player[]> {
    const filters: Prisma.PlayerWhereInput = {};

    if (name?.trim()) {
      // Kiểm tra name không rỗng
      filters.name = {
        contains: name.trim(),
        mode: 'insensitive',
      };
    }

    if (teamId) {
      filters.teamId = teamId;
    }

    if (nationality?.trim()) {
      // Kiểm tra nationality không rỗng
      filters.nationality = {
        contains: nationality.trim(),
        mode: 'insensitive',
      };
    }

    if (isActive !== undefined) {
      filters.isActive = isActive;
    }

    const players = await this.prisma.player.findMany({
      where: filters,
      include: { team: true },
    });

    // ✅ Kiểm tra nếu không có cầu thủ thì ném lỗi ngay
    if (!players || players.length === 0) {
      throw new HttpException(
        'No players found matching the criteria.',
        HttpStatus.NOT_FOUND,
      );
    }

    return players;
  }

  async getPlayerById(id: string): Promise<Player> {
    const player = await this.prisma.player.findUnique({
      where: { id },
      include: { team: true },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return player;
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    // Check if team exists
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    return this.prisma.player.findMany({
      where: { teamId },
      include: { team: true },
    });
  }

  async createPlayer(data: CreatePlayerDto): Promise<Player> {
    // Check if team exists
    const team = await this.prisma.team.findUnique({
      where: { id: data.teamId },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${data.teamId} not found`);
    }

    // Check if player number is unique within the team
    const existingPlayer = await this.prisma.player.findFirst({
      where: {
        number: data.number,
        teamId: data.teamId,
      },
    });

    if (existingPlayer) {
      throw new HttpException(
        `Player with number ${data.number} already exists in this team`,
        HttpStatus.CONFLICT,
      );
    }

    return this.prisma.player.create({
      data: {
        ...data,
        birthDate: new Date(data.birthDate),
      },
      include: { team: true },
    });
  }

  async updatePlayer(id: string, data: UpdatePlayerDto): Promise<Player> {
    // Check if player exists
    await this.getPlayerById(id);

    // If teamId is being updated, check if the team exists
    if (data.teamId) {
      const team = await this.prisma.team.findUnique({
        where: { id: data.teamId },
      });

      if (!team) {
        throw new NotFoundException(`Team with ID ${data.teamId} not found`);
      }

      // Check if player number is unique within the new team
      if (data.number) {
        const existingPlayer = await this.prisma.player.findFirst({
          where: {
            number: data.number,
            teamId: data.teamId,
            id: { not: id }, // Exclude current player
          },
        });

        if (existingPlayer) {
          throw new HttpException(
            `Player with number ${data.number} already exists in this team`,
            HttpStatus.CONFLICT,
          );
        }
      }
    }

    // Process birthDate if provided
    const updateData: any = { ...data };
    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate);
    }

    return this.prisma.player.update({
      where: { id },
      data: updateData,
      include: { team: true },
    });
  }

  async deletePlayer(id: string): Promise<Player> {
    // Check if player exists
    await this.getPlayerById(id);

    return this.prisma.player.delete({
      where: { id },
      include: { team: true },
    });
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlayersPagination(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Player[]> {
    return this.prisma.player.findMany({
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
    });
  }

  async getAllPlayers(
    name?: string,
    teamId?: string,
    nationality?: string,
    isActive?: boolean,
  ): Promise<Player[]> {
    const filters: Prisma.PlayerWhereInput = {};

    if (name) {
      filters.name = {
        contains: name, // Changed from equals to contains for partial matching
        mode: 'insensitive',
      };
    }
    if (teamId) {
      filters.teamId = teamId;
    }
    if (nationality) {
      filters.nationality = {
        contains: nationality, // Changed from equals to contains for partial matching
        mode: 'insensitive',
      };
    }
    if (isActive !== undefined) {
      filters.isActive = isActive;
    }
    const players = await this.prisma.player.findMany({
      where: filters,
    });

    if (players.length === 0) {
      throw new HttpException(
        'No players found matching the criteria.',
        HttpStatus.NOT_FOUND,
      );
    }

    return players;
  }
}

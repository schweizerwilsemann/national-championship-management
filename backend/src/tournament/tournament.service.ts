import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Tournament, TournamentStatus } from '@prisma/client';
import {
  CreateTournamentDto,
  UpdateTournamentDto,
} from './dtos/tournament.dto';

@Injectable()
export class TournamentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTournaments(): Promise<Tournament[]> {
    return this.prisma.tournament.findMany({
      orderBy: { startDate: 'desc' },
    });
  }

  async getTournamentById(id: string): Promise<Tournament | null> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return tournament;
  }

  async getOngoingEPL(): Promise<Tournament | null> {
    return this.prisma.tournament.findFirst({
      where: {
        name: { contains: 'Premier League', mode: 'insensitive' }, // Không phân biệt chữ hoa/chữ thường
        status: TournamentStatus.ONGOING,
      },
    });
  }

  async createTournament(data: CreateTournamentDto): Promise<Tournament> {
    return this.prisma.tournament.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
  }

  async updateTournament(
    id: string,
    data: UpdateTournamentDto,
  ): Promise<Tournament> {
    // Check if tournament exists
    await this.getTournamentById(id);

    // Process dates if provided
    const updateData: any = { ...data };
    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }
    if (data.endDate) {
      updateData.endDate = new Date(data.endDate);
    }

    return this.prisma.tournament.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteTournament(id: string): Promise<Tournament> {
    // Check if tournament exists
    await this.getTournamentById(id);

    return this.prisma.tournament.delete({
      where: { id },
    });
  }
}

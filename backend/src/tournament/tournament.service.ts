import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Tournament, TournamentStatus } from '@prisma/client';

@Injectable()
export class TournamentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTournaments(): Promise<Tournament[]> {
    return this.prisma.tournament.findMany();
  }

  async getTournamentById(id: string): Promise<Tournament | null> {
    return this.prisma.tournament.findUnique({
      where: { id },
    });
  }

  async getOngoingEPL(): Promise<Tournament | null> {
    return this.prisma.tournament.findFirst({
      where: {
        name: { contains: 'Premier League', mode: 'insensitive' }, // Không phân biệt chữ hoa/chữ thường
        status: TournamentStatus.ONGOING,
      },
    });
  }
}

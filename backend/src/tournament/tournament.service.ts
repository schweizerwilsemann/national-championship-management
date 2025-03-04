import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Tournament } from '@prisma/client';

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
}

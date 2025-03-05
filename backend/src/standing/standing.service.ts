import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Standing } from '@prisma/client';

@Injectable()
export class StandingService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentStanding(tournamentId: string): Promise<Standing[]> {
    return this.prisma.standing.findMany({
      where: { tournamentId },
      orderBy: { points: 'desc' },
      include: { team: { select: { name: true } } }, // Joining table to display name
    });
  }
}

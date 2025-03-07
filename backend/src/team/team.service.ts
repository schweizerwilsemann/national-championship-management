import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Team } from '@prisma/client';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTeams(): Promise<Team[]> {
    return this.prisma.team.findMany();
  }
}

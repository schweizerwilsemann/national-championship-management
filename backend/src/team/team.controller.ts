import { TeamService } from './team.service';
import { Team } from '@prisma/client';
import { Controller, Get, Param, UsePipes } from '@nestjs/common';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getAllTeam(): Promise<Team[]> {
    return this.teamService.getAllTeams();
  }
}

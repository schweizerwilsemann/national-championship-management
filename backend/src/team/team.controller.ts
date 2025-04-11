import { TeamService } from './team.service';
import { Team } from '@prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  Query,
} from '@nestjs/common';
import { UUIDValidationPipe } from '@/pipes/uuid-validation.pipe';
import { CreateTeamDto, UpdateTeamDto } from './dtos/team.dto';
import { Roles } from '@/decorators/roles.decorator';
import { Public } from '@/decorators/public.decorator';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Public()
  @Get()
  async getAllTeams(): Promise<Team[]> {
    return this.teamService.getAllTeams();
  }

  @Public()
  @Get('tournament/:tournamentId')
  @UsePipes(UUIDValidationPipe)
  async getTeamsByTournament(
    @Param('tournamentId') tournamentId: string,
  ): Promise<Team[]> {
    return this.teamService.getTeamsByTournament(tournamentId);
  }

  @Public()
  @Get(':id/players')
  @UsePipes(UUIDValidationPipe)
  async getTeamPlayers(@Param('id') id: string) {
    return this.teamService.getTeamPlayers(id);
  }

  @Public()
  @Get(':id')
  async getTeamById(
    @Param('id') id: string,
    @Query('include') include?: string,
  ): Promise<Team> {
    const includePlayers = include === 'players';
    return this.teamService.getTeamById(id, includePlayers);
  }

  @Post()
  @Roles('ADMIN', 'ORGANIZER')
  async createTeam(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamService.createTeam(createTeamDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'ORGANIZER')
  async updateTeam(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    return this.teamService.updateTeam(id, updateTeamDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UsePipes(UUIDValidationPipe)
  async deleteTeam(@Param('id') id: string): Promise<Team> {
    return this.teamService.deleteTeam(id);
  }
}

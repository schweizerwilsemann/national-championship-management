import { UUIDValidationPipe } from '@/pipes/uuid-validation.pipe';
import { TournamentService } from './tournament.service';
import { Tournament } from '@prisma/client';
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
} from '@nestjs/common';
import {
  CreateTournamentDto,
  UpdateTournamentDto,
} from './dtos/tournament.dto';
import { Roles } from '@/decorators/roles.decorator';
import { Public } from '@/decorators/public.decorator';

@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) { }

  @Public()
  @Get()
  async getAllTournaments(): Promise<Tournament[]> {
    return this.tournamentService.getAllTournaments();
  }

  @Public()
  @Get('epl/ongoing-tournament')
  async getOngoingTournament(): Promise<Tournament | null> {
    return this.tournamentService.getOngoingEPL();
  }

  // ===>>>> DO NOT PASS ANY PARAMS AFTER 'tournaments/{params} it will be got by this route as dynamic params
  @Public()
  @Get(':id')
  @UsePipes(UUIDValidationPipe)
  async getTournamentById(@Param('id') id: string): Promise<Tournament | null> {
    return this.tournamentService.getTournamentById(id);
  }

  @Post()
  @Roles('ADMIN', 'ORGANIZER')
  async createTournament(
    @Body() createTournamentDto: CreateTournamentDto,
  ): Promise<Tournament> {
    return this.tournamentService.createTournament(createTournamentDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'ORGANIZER')
  @UsePipes(UUIDValidationPipe)
  async updateTournament(
    @Param('id') id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ): Promise<Tournament> {
    return this.tournamentService.updateTournament(id, updateTournamentDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UsePipes(UUIDValidationPipe)
  async deleteTournament(@Param('id') id: string): Promise<Tournament> {
    return this.tournamentService.deleteTournament(id);
  }
}

import { UUIDValidationPipe } from '@/pipes/uuid-validation.pipe';
import { TournamentService } from './tournament.service';
import { Tournament } from '@prisma/client';
import { Controller, Get, Param, UsePipes } from '@nestjs/common';

@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  async getAllTournaments(): Promise<Tournament[]> {
    return this.tournamentService.getAllTournaments();
  }
  // ===>>>> DO NOT PASS ANY PARAMS AFTER 'tournaments/{params} it will be got by this route as dynamic params
  @Get(':id')
  @UsePipes(UUIDValidationPipe)
  async getTournamentById(@Param('id') id: string): Promise<Tournament | null> {
    return this.tournamentService.getTournamentById(id);
  }
  @Get('/epl/ongoing-tournament')
  async getOngoingTournament(): Promise<Tournament | null> {
    return this.tournamentService.getOngoingEPL();
  }
}

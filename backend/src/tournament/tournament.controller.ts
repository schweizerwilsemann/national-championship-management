import { Controller, Get, Param } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { Tournament } from '@prisma/client';

@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  async getAllTournaments(): Promise<Tournament[]> {
    return this.tournamentService.getAllTournaments();
  }

  @Get(':id')
  async getTournamentById(@Param('id') id: string): Promise<Tournament | null> {
    return this.tournamentService.getTournamentById(id);
  }
}

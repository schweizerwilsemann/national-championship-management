import { Controller, Get, Param } from '@nestjs/common';
import { StandingService } from './standing.service';
import { Standing } from '@prisma/client';

@Controller('standings')
export class StandingController {
  constructor(private readonly standingService: StandingService) {}

  @Get(':tournamentId')
  async getCurrentStanding(
    @Param('tournamentId') tournamentId: string,
  ): Promise<Standing[]> {
    return this.standingService.getCurrentStanding(tournamentId);
  }
}

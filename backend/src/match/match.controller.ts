import { Controller, Get, Query, Param } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from '@prisma/client';
import { MatchStatus } from '@prisma/client'; // Import MatchStatus enum

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get(':tournamentId/scheduled')
  async getScheduledMatches(
    @Param('tournamentId') tournamentId: string,
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to limit of 10
  ): Promise<Record<string, Match[]>> {
    return this.matchService.getMatches(
      tournamentId,
      MatchStatus.SCHEDULED,
      page,
      limit,
    );
  }

  @Get(':tournamentId/live')
  async getLiveMatches(
    @Param('tournamentId') tournamentId: string,
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to limit of 10
  ): Promise<Record<string, Match[]>> {
    return this.matchService.getMatches(
      tournamentId,
      MatchStatus.LIVE,
      page,
      limit,
    );
  }

  @Get(':tournamentId/finished')
  async getFinishedMatches(
    @Param('tournamentId') tournamentId: string,
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to limit of 10
  ): Promise<Record<string, Match[]>> {
    return this.matchService.getMatches(
      tournamentId,
      MatchStatus.FINISHED,
      page,
      limit,
    );
  }

  @Get(':tournamentId')
  async getAllMatches(
    @Param('tournamentId') tournamentId: string,
    @Query('status') status?: MatchStatus, // Optional status query parameter
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to limit of 10
  ): Promise<Record<string, Match[]>> {
    return this.matchService.getMatches(tournamentId, status, page, limit);
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { Match, MatchStatus } from '@prisma/client';
import { UUIDValidationPipe } from '@/pipes/uuid-validation.pipe';
import { CreateMatchDto, UpdateMatchDto } from './dtos/match.dto';
import { Roles } from '@/decorators/roles.decorator';
import { Public } from '@/decorators/public.decorator';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Public()
  @Get('finished/team')
  async getTeamMatches(
    @Query('teamId') teamId: string,
    @Query('tournamentId') tournamentId?: string,
    @Query('status') status?: MatchStatus,
    @Query('limit') limit: number = 5,
  ): Promise<Match[]> {
    return this.matchService.getTeamMatches(
      teamId,
      tournamentId,
      status,
      limit,
    );
  }
  @Public()
  @Public()
  @Get(':tournamentId/scheduled')
  async getScheduledMatches(
    @Param('tournamentId') tournamentId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: Record<string, Match[]>; meta: { total: number } }> {
    return this.matchService.getScheduledMatches(tournamentId, page, limit);
  }

  @Public()
  @Get(':tournamentId/postponed')
  async getPostponedMatches(
    @Param('tournamentId') tournamentId: string,
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to limit of 10
  ): Promise<{ data: Record<string, Match[]>; meta: { total: number } }> {
    return this.matchService.getMatches(
      tournamentId,
      MatchStatus.POSTPONED,
      page,
      limit,
    );
  }

  @Public()
  @Get(':tournamentId/live')
  async getLiveMatches(
    @Param('tournamentId') tournamentId: string,
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to limit of 10
  ): Promise<{ data: Record<string, Match[]>; meta: { total: number } }> {
    return this.matchService.getMatches(
      tournamentId,
      MatchStatus.LIVE,
      page,
      limit,
    );
  }

  @Public()
  @Get(':tournamentId/finished')
  async getFinishedMatches(
    @Param('tournamentId') tournamentId: string,
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to limit of 10
  ): Promise<{ data: Record<string, Match[]>; meta: { total: number } }> {
    return this.matchService.getMatches(
      tournamentId,
      MatchStatus.FINISHED,
      page,
      limit,
    );
  }

  @Public()
  @Get('search')
  async searchMatches(
    @Query('searchTerm') searchTerm: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('tournamentId') tournamentId?: string,
    @Query('status') status?: string,
  ) {
    // Validate status if provided
    let validatedStatus: MatchStatus | undefined;
    if (status) {
      // Check if the provided status is a valid MatchStatus
      if (!Object.values(MatchStatus).includes(status as MatchStatus)) {
        throw new BadRequestException(
          `Invalid match status. Valid statuses are: ${Object.values(MatchStatus).join(', ')}`,
        );
      }
      validatedStatus = status as MatchStatus;
    }

    return this.matchService.searchMatchesByRegex(
      searchTerm,
      page,
      limit,
      tournamentId,
      validatedStatus,
    );
  }

  @Public()
  @Get(':tournamentId')
  async getAllMatches(
    @Param('tournamentId') tournamentId: string,
    @Query('status') status?: MatchStatus, // Optional status query parameter
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to limit of 10
  ): Promise<{ data: Record<string, Match[]>; meta: { total: number } }> {
    return this.matchService.getMatches(tournamentId, status, page, limit);
  }

  @Public()
  @Get('detail/:id')
  @UsePipes(UUIDValidationPipe)
  async getMatchById(@Param('id') id: string): Promise<Match> {
    return this.matchService.getMatchById(id);
  }

  @Post()
  @Roles('ADMIN', 'ORGANIZER')
  async createMatch(@Body() createMatchDto: CreateMatchDto): Promise<Match> {
    return this.matchService.createMatch(createMatchDto);
  }
  @Put(':id')
  @Roles('ADMIN', 'ORGANIZER')
  async updateMatch(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    return this.matchService.updateMatch(id, updateMatchDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UsePipes(UUIDValidationPipe)
  async deleteMatch(@Param('id') id: string): Promise<Match> {
    return this.matchService.deleteMatch(id);
  }
}

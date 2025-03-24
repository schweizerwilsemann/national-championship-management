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
import { StandingService } from './standing.service';
import { Standing } from '@prisma/client';
import { UUIDValidationPipe } from '@/pipes/uuid-validation.pipe';
import { CreateStandingDto, UpdateStandingDto } from './dtos/standing.dto';
import { Roles } from '@/decorators/roles.decorator';
import { Public } from '@/decorators/public.decorator';

@Controller('standings')
export class StandingController {
  constructor(private readonly standingService: StandingService) {}

  @Public()
  @Get()
  async getAllStandings(): Promise<Standing[]> {
    return this.standingService.getAllStandings();
  }

  @Public()
  @Get('tournament/:tournamentId')
  @UsePipes(UUIDValidationPipe)
  async getCurrentStanding(
    @Param('tournamentId') tournamentId: string,
  ): Promise<Standing[]> {
    return this.standingService.getCurrentStanding(tournamentId);
  }

  @Public()
  @Get(':id')
  @UsePipes(UUIDValidationPipe)
  async getStandingById(@Param('id') id: string): Promise<Standing> {
    return this.standingService.getStandingById(id);
  }

  @Public()
  @Get('team/:teamId/tournament/:tournamentId')
  @UsePipes(UUIDValidationPipe)
  async getStandingByTeamAndTournament(
    @Param('teamId') teamId: string,
    @Param('tournamentId') tournamentId: string,
  ): Promise<Standing> {
    return this.standingService.getStandingByTeamAndTournament(
      teamId,
      tournamentId,
    );
  }

  @Post()
  @Roles('ADMIN', 'ORGANIZER')
  async createStanding(
    @Body() createStandingDto: CreateStandingDto,
  ): Promise<Standing> {
    return this.standingService.createStanding(createStandingDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'ORGANIZER')
  @UsePipes(UUIDValidationPipe)
  async updateStanding(
    @Param('id') id: string,
    @Body() updateStandingDto: UpdateStandingDto,
  ): Promise<Standing> {
    return this.standingService.updateStanding(id, updateStandingDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UsePipes(UUIDValidationPipe)
  async deleteStanding(@Param('id') id: string): Promise<Standing> {
    return this.standingService.deleteStanding(id);
  }

  @Post('update-after-match/:matchId')
  @Roles('ADMIN', 'ORGANIZER', 'REFEREE')
  @UsePipes(UUIDValidationPipe)
  async updateStandingAfterMatch(
    @Param('matchId') matchId: string,
  ): Promise<void> {
    return this.standingService.updateStandingAfterMatch(matchId);
  }
}

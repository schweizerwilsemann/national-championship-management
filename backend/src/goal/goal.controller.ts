import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GoalService } from './goal.service';
import { Goal } from '@prisma/client';
import { UUIDValidationPipe } from '@/pipes/uuid-validation.pipe';
import { CreateGoalDto, UpdateGoalDto } from './dtos/goal.dto';
import { Roles } from '@/decorators/roles.decorator';
import { Public } from '@/decorators/public.decorator';

@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Public()
  @Get()
  @Get()
  async getAllGoals(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<{ data: Goal[]; meta: { total: number } }> {
    return this.goalService.getAllGoals(page, pageSize);
  }

  @Public()
  @Get('match/:matchId')
  @UsePipes(UUIDValidationPipe)
  async getGoalsByMatch(@Param('matchId') matchId: string): Promise<Goal[]> {
    return this.goalService.getGoalsByMatch(matchId);
  }

  @Public()
  @Get('player/:playerId')
  @UsePipes(UUIDValidationPipe)
  async getGoalsByPlayer(@Param('playerId') playerId: string): Promise<Goal[]> {
    return this.goalService.getGoalsByPlayer(playerId);
  }

  @Public()
  @Get('top-scorers')
  async getTopScorers(
    @Query('tournamentId') tournamentId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.goalService.getTopScorers(
      tournamentId,
      Number(page),
      Number(limit),
    );
  }

  @Public()
  @Get('/search-scorers')
  async searchScorers(
    @Query('searchTerm') searchTerm: string,
    @Query('matchId') matchId?: string,
    @Query('tournamentId') tournamentId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.goalService.searchScorers({
      searchTerm,
      matchId,
      tournamentId,
      page,
      limit,
    });
  }
  @Public()
  @Get(':id')
  @UsePipes(UUIDValidationPipe)
  async getGoalById(@Param('id') id: string): Promise<Goal> {
    return this.goalService.getGoalById(id);
  }

  @Post()
  @Roles('ADMIN', 'ORGANIZER', 'REFEREE')
  async createGoal(@Body() createGoalDto: CreateGoalDto): Promise<Goal> {
    return this.goalService.createGoal(createGoalDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'ORGANIZER', 'REFEREE')
  async updateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ): Promise<Goal> {
    return this.goalService.updateGoal(id, updateGoalDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'REFEREE')
  @UsePipes(UUIDValidationPipe)
  async deleteGoal(@Param('id') id: string): Promise<Goal> {
    return this.goalService.deleteGoal(id);
  }
}

import { PlayerService } from './player.service';
import { Player } from '@prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { UUIDValidationPipe } from '@/pipes/uuid-validation.pipe';
import { CreatePlayerDto, UpdatePlayerDto } from './dtos/player.dto';
import { Roles } from '@/decorators/roles.decorator';
import { Public } from '@/decorators/public.decorator';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Public()
  @Get()
  async getPlayersPagination(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<{ data: Player[]; meta: { total: number } }> {
    return this.playerService.getPlayersPagination(page, pageSize);
  }
  @Public()
  @Get('filter-players')
  async filterPlayers(
    @Query('name') name?: string,
    @Query('teamId') teamId?: string,
    @Query('nationality') nationality?: string,
    @Query('isActive') isActive?: boolean,
  ): Promise<Player[]> {
    return this.playerService.getAllPlayers(
      name,
      teamId,
      nationality,
      isActive,
    );
  }

  @Public()
  @Get(':id')
  @UsePipes(UUIDValidationPipe)
  async getPlayerById(@Param('id') id: string): Promise<Player> {
    return this.playerService.getPlayerById(id);
  }

  @Public()
  @Get('team/:teamId')
  @UsePipes(UUIDValidationPipe)
  async getPlayersByTeam(@Param('teamId') teamId: string): Promise<Player[]> {
    return this.playerService.getPlayersByTeam(teamId);
  }

  @Post()
  @Roles('ADMIN', 'ORGANIZER')
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return this.playerService.createPlayer(createPlayerDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'ORGANIZER')
  async updatePlayer(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    return this.playerService.updatePlayer(id, updatePlayerDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UsePipes(UUIDValidationPipe)
  async deletePlayer(@Param('id') id: string): Promise<Player> {
    return this.playerService.deletePlayer(id);
  }
}

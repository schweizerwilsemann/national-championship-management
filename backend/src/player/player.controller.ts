import { PlayerService } from './player.service';
import { Player } from '@prisma/client';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  async getPlayersPagination(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<Player[]> {
    return this.playerService.getPlayersPagination(page, pageSize);
  }

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
}

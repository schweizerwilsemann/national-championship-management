import { PlayerService } from './player.service';
import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}

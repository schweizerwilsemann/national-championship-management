import { PlayerService } from './player.service';
import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [PlayerController],
  providers: [PlayerService, JwtAuthGuard, JwtService],
  exports: [PlayerService],
})
export class PlayerModule {}

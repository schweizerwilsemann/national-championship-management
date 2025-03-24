import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [TournamentController],
  providers: [TournamentService, JwtAuthGuard, JwtService],
  exports: [TournamentService],
})
export class TournamentModule {}

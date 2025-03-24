import { TeamService } from './team.service';
import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [TeamController],
  providers: [TeamService, JwtAuthGuard, JwtService],
  exports: [TeamService],
})
export class TeamModule {}

import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { PrismaService } from '@/prisma/prisma.service'; // Ensure PrismaService is imported
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MatchController],
  providers: [MatchService, PrismaService, JwtService], // Include PrismaService as a provider
})
export class MatchModule {}

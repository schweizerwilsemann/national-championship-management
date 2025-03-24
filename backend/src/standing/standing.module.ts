import { Module } from '@nestjs/common';
import { StandingService } from './standing.service';
import { StandingController } from './standing.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [StandingController],
  providers: [StandingService],
  exports: [StandingService],
})
export class StandingModule {}

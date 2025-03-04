import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@/auth/auth.module';
import { StandingModule } from '@/standing/standing.module';
import { TournamentModule } from '@/tournament/tournament.module';

@Module({
  imports: [
    AuthModule,
    JwtModule,
    ConfigModule.forRoot({ isGlobal: true }),
    StandingModule,
    TournamentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

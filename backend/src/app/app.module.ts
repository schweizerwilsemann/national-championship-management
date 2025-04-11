import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@/auth/auth.module';
import { StandingModule } from '@/standing/standing.module';
import { TournamentModule } from '@/tournament/tournament.module';
import { MatchModule } from '@/match/match.module';
import { PlayerModule } from '@/player/player.module';
import { TeamModule } from '@/team/team.module';
import { GoalModule } from '@/goal/goal.module';
import { UserModule } from '@/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';

@Module({
  imports: [
    AuthModule,
    JwtModule,
    ConfigModule.forRoot({ isGlobal: true }),
    StandingModule,
    TournamentModule,
    MatchModule,
    PlayerModule,
    TeamModule,
    GoalModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Đăng ký Global Guard cho xác thực JWT
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Đăng ký Global Guard cho kiểm tra quyền
    },
  ],
})
export class AppModule { }

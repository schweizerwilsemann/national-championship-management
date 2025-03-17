import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { MatchStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateMatchDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  matchday: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @IsOptional()
  @IsInt()
  homeScore?: number;

  @IsOptional()
  @IsInt()
  awayScore?: number;

  @IsOptional()
  @IsString()
  highlights?: string;

  @IsNotEmpty()
  @IsUUID()
  tournamentId: string;

  @IsNotEmpty()
  @IsUUID()
  homeTeamId: string;

  @IsNotEmpty()
  @IsUUID()
  awayTeamId: string;
}

export class UpdateMatchDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  matchday?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @IsOptional()
  @IsInt()
  homeScore?: number;

  @IsOptional()
  @IsInt()
  awayScore?: number;

  @IsOptional()
  @IsString()
  highlights?: string;

  @IsOptional()
  @IsUUID()
  tournamentId?: string;

  @IsOptional()
  @IsUUID()
  homeTeamId?: string;

  @IsOptional()
  @IsUUID()
  awayTeamId?: string;
}

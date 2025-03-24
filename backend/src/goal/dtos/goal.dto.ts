import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { GoalType } from '@prisma/client';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  minute: number;

  @IsOptional()
  @IsEnum(GoalType)
  type?: GoalType;

  @IsOptional()
  @IsBoolean()
  isOwnGoal?: boolean;

  @IsOptional()
  @IsBoolean()
  isPenalty?: boolean;

  @IsNotEmpty()
  @IsUUID()
  matchId: string;

  @IsNotEmpty()
  @IsUUID()
  scorerId: string;
}

export class UpdateGoalDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  minute?: number;

  @IsOptional()
  @IsEnum(GoalType)
  type?: GoalType;

  @IsOptional()
  @IsBoolean()
  isOwnGoal?: boolean;

  @IsOptional()
  @IsBoolean()
  isPenalty?: boolean;

  @IsOptional()
  @IsUUID()
  matchId?: string;

  @IsOptional()
  @IsUUID()
  scorerId?: string;
}

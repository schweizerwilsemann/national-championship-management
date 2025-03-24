import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateStandingDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  position: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  played?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  won?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  drawn?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lost?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  goalsFor?: number;

  @IsOptional()
  @IsInt()
  goalsAgainst?: number;

  @IsOptional()
  @IsInt()
  goalDifference?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;

  @IsOptional()
  @IsString()
  form?: string;

  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @IsNotEmpty()
  @IsUUID()
  tournamentId: string;
}

export class UpdateStandingDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  played?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  won?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  drawn?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lost?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  goalsFor?: number;

  @IsOptional()
  @IsInt()
  goalsAgainst?: number;

  @IsOptional()
  @IsInt()
  goalDifference?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;

  @IsOptional()
  @IsString()
  form?: string;

  @IsOptional()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  @IsUUID()
  tournamentId?: string;
}

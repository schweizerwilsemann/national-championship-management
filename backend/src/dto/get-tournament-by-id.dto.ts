import { IsUUID } from 'class-validator';

export class GetTournamentByIdDto {
  @IsUUID()
  id: string;
}

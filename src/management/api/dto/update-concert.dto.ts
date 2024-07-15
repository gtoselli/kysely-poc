import { IsOptional, IsString } from 'class-validator';

export class UpdateConcertDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

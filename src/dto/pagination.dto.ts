import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset: number = 0;
}

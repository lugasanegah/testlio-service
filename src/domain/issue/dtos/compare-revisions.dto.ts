import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CompareRevisionsDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  revisionA: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  revisionB: number;
}
import { IsInt, Min } from 'class-validator';

export class CompareRevisionsDto {
  @IsInt()
  @Min(1)
  revisionA: number;

  @IsInt()
  @Min(1)
  revisionB: number;
}
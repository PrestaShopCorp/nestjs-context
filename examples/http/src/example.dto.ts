import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
export class ExampleDto {
  @IsNotEmpty()
  @MaxLength(16)
  dto_id: string;

  @IsOptional()
  @MaxLength(2)
  code?: string;
}

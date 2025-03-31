import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Priority } from '@prisma/client';
import { Transform } from 'class-transformer';

export class WorkspaceDto {
  id: string;

  createdAt: number;

  updatedAt: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Priority)
  @IsOptional()
  @Transform(({ value }) => ('' + value).toLowerCase())
  priority?: Priority;
}

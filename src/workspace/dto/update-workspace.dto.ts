import { PartialType } from '@nestjs/swagger';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}

export class UpdateWorkspaceMembersDto {
  @IsOptional()
  include: { email: string; role: Role };

  @IsOptional()
  exclude: string;
}

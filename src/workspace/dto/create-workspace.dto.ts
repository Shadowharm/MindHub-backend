import { PickType } from '@nestjs/mapped-types';
import { WorkspaceDto } from './workspace.dto';

export class CreateWorkspaceDto extends PickType(WorkspaceDto, [
  'name',
  'description',
]) {}

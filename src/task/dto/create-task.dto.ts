import { PickType } from '@nestjs/mapped-types';
import { TaskDto } from './task.dto';

export class CreateTaskDto extends PickType(TaskDto, [
  'name',
  'workspaceId',
  'isCompleted',
  'createdAt',
]) {}

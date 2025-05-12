import {
  Controller,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  Put,
  Param,
  Delete,
  Post,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CurrentUser } from '../auth/decorators/user.decorators';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User, Workspace } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Задачи')
@Controller('user/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({
    summary: 'Получение списка задач',
  })
  @Get()
  @Auth()
  async getAll(
    @CurrentUser('id') userId: User['id'],
    @Query('workspaceId') workspaceId: Workspace['id'],
  ) {
    return this.taskService.getAll(workspaceId, userId);
  }

  @ApiOperation({
    summary: 'Создание задачи',
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@Body() dto: CreateTaskDto, @CurrentUser('id') userId: string) {
    return this.taskService.create(dto, userId);
  }

  @ApiOperation({
    summary: 'Редактирование задачи',
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async update(
    @Body() dto: UpdateTaskDto,
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.taskService.update(dto, id, userId);
  }

  @ApiOperation({
    summary: 'Удаление задачи',
  })
  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}

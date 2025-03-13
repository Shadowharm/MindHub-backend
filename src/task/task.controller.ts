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
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CurrentUser } from '../auth/decorators/user.decorators';
import { TaskDto } from './dto/task.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Задачи')
@Controller('user/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({
    summary: 'Получение списка задач',
  })
  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: string) {
    return this.taskService.getAll(userId);
  }

  @ApiOperation({
    summary: 'Создание задачи',
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@Body() dto: TaskDto, @CurrentUser('id') userId: string) {
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
    @Body() dto: TaskDto,
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

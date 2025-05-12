import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  Put,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import {
  UpdateWorkspaceDto,
  UpdateWorkspaceMembersDto,
} from './dto/update-workspace.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorators';
import { User } from '@prisma/client';
@ApiTags('Воркспейсы')
@Controller('user/workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @ApiOperation({
    summary: 'Создание воркспейса',
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @CurrentUser('id') userId: User['id'],
  ) {
    return this.workspaceService.create(createWorkspaceDto, userId);
  }

  @ApiOperation({
    summary: 'Получение списка воркспейсов',
  })
  @Get()
  @Auth()
  findAll(@CurrentUser('id') userId: User['id']) {
    return this.workspaceService.findAll(userId);
  }

  @ApiOperation({
    summary: 'Получение одного воркспейса',
  })
  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: User['id']) {
    return this.workspaceService.findOne(id, userId);
  }

  @ApiOperation({
    summary: 'Редактирование воркспейса',
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @CurrentUser('id') userId: User['id'],
  ) {
    return this.workspaceService.update(id, updateWorkspaceDto, userId);
  }

  @ApiOperation({
    summary: 'Редактирование участников воркспейса',
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(204)
  @Put(':id/toggle-members')
  @Auth()
  updateMembers(
    @Param('id') id: string,
    @Body() updateWorkspaceMembersDto: UpdateWorkspaceMembersDto,
    @CurrentUser('id') userId: User['id'],
  ) {
    return this.workspaceService.updateMembers(
      id,
      updateWorkspaceMembersDto,
      userId,
    );
  }

  @ApiOperation({
    summary: 'Удаление задачи',
  })
  @HttpCode(200)
  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @CurrentUser('id') userId: User['id']) {
    return this.workspaceService.remove(id, userId);
  }
}

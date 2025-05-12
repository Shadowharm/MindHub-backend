import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TaskDto } from './dto/task.dto';
import { User, Workspace } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  getAll(workspaceId: Workspace['id'], userId: User['id']) {
    return this.prisma.task.findMany({
      where: {
        userId,
        workspaceId,
      },
    });
  }

  getById(id: string) {
    return this.prisma.task.findUnique({
      where: {
        id,
      },
    });
  }

  async create({ workspaceId, ...dto }: TaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId,
          },
        },
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
      },
    });
  }

  update(dto: Partial<TaskDto>, taskId: string, userId: string) {
    return this.prisma.task.update({
      where: {
        id: taskId,
        userId,
      },
      data: dto,
    });
  }

  delete(taskId: string) {
    return this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  getAll(userId: string) {
    return this.prisma.task.findMany({
      where: {
        userId,
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

  async create(dto: TaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId,
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

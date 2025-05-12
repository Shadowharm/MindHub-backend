import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { hash } from 'argon2';
import { startOfDay, subDays } from 'date-fns';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private workspaceService: WorkspaceService,
  ) {}

  async create(dto: AuthDto) {
    try {
      return this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: dto.email,
            name: dto.name,
          },
        });
        await Promise.all([
          this.workspaceService.create({ name: 'Мои задачи' }, user.id, tx),
          tx.userPassword.create({
            data: { userId: user.id, password: await hash(dto.password) },
          }),
          tx.userSettings.create({ data: { userId: user.id } }),
        ]);
        return user;
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      return this.prisma.$transaction(async (tx) => {
        const [user] = await Promise.all([
          tx.user.update({
            data: {
              email: dto.email,
              name: dto.name,
            },
            where: {
              id,
            },
          }),
          ...(dto.password
            ? [
                tx.userPassword.update({
                  data: { password: await hash(dto.password) },
                  where: { userId: id },
                }),
              ]
            : []),
          tx.userSettings.update({
            data: {
              workInterval: dto.workInterval || 25,
              breakInterval: dto.breakInterval || 5,
              intervalsCount: dto.intervalsCount || 10,
            },
            where: { userId: id },
          }),
        ]);
        return user;
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  getWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        password: true,
      },
    });
  }

  getById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        settings: true,
        tasks: true,
      },
    });
  }

  async getProfile(id: string) {
    const profile = await this.getById(id);
    const totalTasks = profile.tasks.length;
    const completedTasks = await this.prisma.task.count({
      where: {
        userId: id,
        isCompleted: true,
      },
    });
    const todayStart = startOfDay(new Date());
    const weekStart = startOfDay(subDays(new Date(), 7));

    const todayTasks = await this.prisma.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: todayStart.toISOString(),
        },
      },
    });

    const weekTasks = await this.prisma.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: weekStart.toISOString(),
        },
      },
    });

    return {
      user: profile,
      statistics: {
        totalTasks,
        completedTasks,
        todayTasks,
        weekTasks,
      },
    };
  }
}

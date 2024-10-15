import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { hash } from 'argon2';
import { startOfDay, subDays } from 'date-fns';
import { User } from '@prisma/client';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  getById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
      },
    });
  }

  getUserWithoutPassword(user: User): Omit<User, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
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
      user: this.getUserWithoutPassword(profile),
      statistics: {
        totalTasks,
        completedTasks,
        todayTasks,
        weekTasks,
      },
    };
  }

  async create(dto: AuthDto) {
    const user = {
      email: dto.email,
      name: '',
      password: await hash(dto.password),
    };

    return this.prisma.user.create({
      data: user,
    });
  }

  async update(id: string, dto: UserDto) {
    let data = dto;

    if (dto.password) {
      data = { ...dto, password: await hash(dto.password) };
    }
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
    return this.getUserWithoutPassword(user);
  }
}

import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import {
  UpdateWorkspaceDto,
  UpdateWorkspaceMembersDto,
} from './dto/update-workspace.dto';
import { PrismaService } from '../prisma.service';
import { Priority, Prisma, Role, User } from '@prisma/client';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    userId: User['id'],
    txForeign?: Prisma.TransactionClient,
  ) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const data = await (txForeign || tx).workspace.create({
          data: createWorkspaceDto,
        });
        await (txForeign || tx).usersOnWorkspaces.create({
          data: {
            userId,
            workspaceId: data.id,
            invitedById: userId,
            role: Role.owner,
          },
        });
        return data;
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  findAll(userId: User['id']) {
    try {
      return this.prisma.workspace.findMany({
        where: {
          users: {
            some: {
              userId,
            },
          },
        },
        include: {
          users: {
            select: {
              user: true,
              role: true,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  findOne(id: string, userId: User['id']) {
    try {
      return this.prisma.workspace.findUnique({
        where: {
          id,
          users: {
            some: {
              userId,
            },
          },
        },
        include: {
          users: {
            select: {
              user: true,
              role: true,
              invitedBy: true,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  update(
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
    userId: User['id'],
  ) {
    try {
      return this.prisma.workspace.update({
        where: {
          id,
          users: {
            some: {
              userId,
            },
          },
        },
        data: updateWorkspaceDto,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async updateMembers(
    id: string,
    updateWorkspaceMembersDto: UpdateWorkspaceMembersDto,
    userId: User['id'],
  ) {
    try {
      await this.prisma.$transaction(async (tx) => {
        if (updateWorkspaceMembersDto.include) {
          const user = await this.prisma.user.findFirst({
            where: { email: updateWorkspaceMembersDto.include.email },
          });
          if (!user) {
            throw new BadRequestException('User not found');
          }
          await tx.usersOnWorkspaces.create({
            data: {
              user: {
                connect: {
                  id: user.id,
                },
              },
              workspace: {
                connect: {
                  id: id,
                },
              },
              role: updateWorkspaceMembersDto.include.role,
              invitedBy: {
                connect: {
                  id: userId,
                },
              },
            },
          });
        }
        if (updateWorkspaceMembersDto.exclude) {
          await tx.usersOnWorkspaces.delete({
            where: {
              userId_workspaceId: {
                userId: updateWorkspaceMembersDto.exclude,
                workspaceId: id,
              },
            },
          });
        }
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  remove(id: string, userId: User['id']) {
    try {
      return this.prisma.workspace.delete({
        where: {
          id,
          users: {
            some: {
              userId,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, error.status);
    }
  }
}

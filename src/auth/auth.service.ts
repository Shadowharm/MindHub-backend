import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { verify } from 'argon2';
import { Response } from 'express';
import { User } from '@prisma/client';
import { URL } from 'node:url';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async login(dto: AuthDto): Promise<{
    user: Omit<User, 'password'>;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);
    return { ...tokens, user };
  }

  async register(dto: AuthDto) {
    try {
      const oldUser = await this.userService.getByEmail(dto.email);
      if (oldUser) throw new BadRequestException('User already exists');

      const user = await this.userService.create(dto);

      const tokens = this.issueTokens(user.id);

      return { ...tokens, user };
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async getNewTokens(refreshToken: string) {
    const data = await this.jwt.verifyAsync(refreshToken);
    if (!data) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.userService.getById(data.id);

    const tokens = this.issueTokens(user.id);
    return {
      user,
      ...tokens,
    };
  }

  private issueTokens(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getWithPassword(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isValide = await verify(user.password.password, dto.password);
    if (!isValide) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.userService.getByEmail(dto.email);
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: new URL(process.env.DOMAIN).hostname,
      expires: expiresIn,
      // secure: true,
      sameSite: 'lax',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: new URL(process.env.DOMAIN).hostname,
      expires: new Date(0),
      // secure: true,
      sameSite: 'lax',
    });
  }
}

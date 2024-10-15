import {
  BadRequestException,
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
    return { ...tokens, user: this.userService.getUserWithoutPassword(user) };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userService.getByEmail(dto.email);
    if (oldUser) throw new BadRequestException('User already exists');

    const user = await this.userService.create(dto);

    const tokens = this.issueTokens(user.id);

    return { ...tokens, user: this.userService.getUserWithoutPassword(user) };
  }

  async getNewTokens(refreshToken: string) {
    const data = await this.jwt.verifyAsync(refreshToken);
    if (!data) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.userService.getById(data.id);

    const tokens = this.issueTokens(user.id);
    return {
      user: this.userService.getUserWithoutPassword(user),
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
    const user = await this.userService.getByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isValide = await verify(user.password, dto.password);
    if (!isValide) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: process.env.DOMAIN,
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: process.env.DOMAIN,
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }
}

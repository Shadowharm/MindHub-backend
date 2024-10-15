import {
  Controller,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from '../auth/decorators/user.decorators';

@Controller('user/profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  @Auth()
  async profile(@CurrentUser('id') id: string) {
    return this.userService.getProfile(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put()
  @Auth()
  async update(@CurrentUser('id') id: string, @Body() body: UserDto) {
    return this.userService.update(id, body);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class PomodoroSettingsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  workInterval?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  breakInterval?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  intervalsCount?: number;
}

export class UserDto extends PomodoroSettingsDto {
  @ApiProperty({
    example: 'cm7xfa4440000ive9d2nz15b3',
    description: 'Уникальный идентификатор',
  })
  id?: number;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Логин пользователя',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '123123',
    description: 'Пароль',
  })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    example: 'Дональд Трамп',
    description: 'Имя пользователя',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

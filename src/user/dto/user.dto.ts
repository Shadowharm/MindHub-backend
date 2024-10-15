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
  @IsEmail()
  @IsOptional()
  email?: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

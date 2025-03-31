import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { TimeBlockModule } from './time-block/time-block.module';
import { PomodoroModule } from './pomodoro/pomodoro.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    TaskModule,
    TimeBlockModule,
    PomodoroModule,
    WorkspaceModule,
  ],
})
export class AppModule {}

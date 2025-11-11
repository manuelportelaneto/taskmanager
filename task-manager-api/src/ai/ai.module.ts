import { Module, forwardRef } from '@nestjs/common';
import { AiService } from './ai.service';
import { MessageController } from './webhooks/message.controller';
import { ConfigModule } from '@nestjs/config';
// CORREÇÃO: Usamos o caminho relativo e direto para o arquivo do módulo.
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => TasksModule), // O forwardRef continua necessário
    UsersModule,
  ],
  controllers: [MessageController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}

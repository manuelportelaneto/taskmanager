import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
// A dependência circular exige que o caminho do import seja preciso.
// Se continuarmos a ter problemas, este será o primeiro lugar a olhar.
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    // O forwardRef é a solução padrão do NestJS para dependências circulares
    forwardRef(() => AiModule),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService], // Exportamos para que outros módulos (como o AiModule) possam usá-lo
})
export class TasksModule {}

import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  UseGuards, // Importamos o UseGuards
} from '@nestjs/common';
import { AiService } from '../ai.service';
import { IncomingMessageDto } from '../dto/incoming-message.dto';
import { TasksService } from '../../tasks/tasks.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'; // Importamos nosso Guard
import { GetUser } from '../../auth/decorators/user.decorator'; // Importamos nosso Decorator
import { User } from '../../users/entities/user.entity'; // Importamos a Entidade User

@Controller('messages')
@UseGuards(JwtAuthGuard) // CORREÇÃO 1: Protegemos o controller inteiro com o Guard JWT
export class MessageController {
  constructor(
    private readonly aiService: AiService,
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  async handleIncomingMessage(
    @Body() incomingMessageDto: IncomingMessageDto,
    @GetUser() user: User, // CORREÇÃO 2: Injetamos o usuário logado, extraído do token pelo Guard
  ) {
    const generatedTaskData = await this.aiService.generateTaskFromText(
      incomingMessageDto.text,
    );

    if (!generatedTaskData) {
      throw new InternalServerErrorException('AI failed to generate task data.');
    }
    
    // CORREÇÃO 3: Usamos o usuário REAL da sessão, não mais um 'fakeUser'
    return this.tasksService.create(
      {
        title: generatedTaskData.title,
        description: generatedTaskData.description,
        rawText: incomingMessageDto.text,
        aiPriority: generatedTaskData.aiPriority,
        aiJustification: generatedTaskData.aiJustification,
      },
      user, // Passamos o usuário autenticado para o serviço de criação
    );
  }
}
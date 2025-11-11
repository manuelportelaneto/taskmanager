import { Controller, Post, Body, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AiService } from '../ai.service';
import { IncomingMessageDto } from '../dto/incoming-message.dto';
import { TasksService } from '../../tasks/tasks.service';
import { UsersService } from '../../users/users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Webhooks')
@Controller('messages')
export class MessageController {
  constructor(
    private readonly aiService: AiService,
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma tarefa a partir de uma mensagem de texto' })
  async handleIncomingMessage(@Body() incomingMessageDto: IncomingMessageDto) {
    const generatedTaskData = await this.aiService.generateTaskFromText(incomingMessageDto.text);
    if (!generatedTaskData) {
      throw new InternalServerErrorException('IA não conseguiu gerar os dados da tarefa.');
    }

    const fakeUser = await this.usersService.findFirst();
    if (!fakeUser) {
      throw new UnauthorizedException('Nenhum usuário de exemplo disponível para associar a tarefa.');
    }
    
    return this.tasksService.create({
      title: generatedTaskData.title,
      description: generatedTaskData.description,
      rawText: incomingMessageDto.text,
      aiPriority: generatedTaskData.aiPriority,
      aiJustification: generatedTaskData.aiJustification,
    }, fakeUser);
  }
}
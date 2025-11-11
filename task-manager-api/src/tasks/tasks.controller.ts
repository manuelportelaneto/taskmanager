import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova tarefa' })
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get('search')
  @ApiOperation({ summary: 'Busca tarefas por semântica' })
  searchTasks(@Query('q') query: string, @GetUser() user: User) {
    return this.tasksService.search(query, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as tarefas do usuário' })
  findAll(@GetUser() user: User) {
    return this.tasksService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma tarefa pelo ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.tasksService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma tarefa' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma tarefa' })
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.tasksService.remove(id, user);
  }
}

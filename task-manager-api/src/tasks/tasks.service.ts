import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { AiService } from '../ai/ai.service';

// Interface para o resultado da busca semântica, que inclui a distância
interface SemanticSearchResult extends Task {
  distance: number;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private readonly aiService: AiService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      user,
    });

    const textToEmbed = `${task.title}. ${task.description}`;
    task.embedding = await this.aiService.generateEmbedding(textToEmbed);

    return this.tasksRepository.save(task);
  }

  findAll(user: User): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' }, // Boa prática: ordenar da mais nova para a mais antiga
    });
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);
    Object.assign(task, updateTaskDto);

    const textToEmbed = `${task.title}. ${task.description}`;
    task.embedding = await this.aiService.generateEmbedding(textToEmbed);

    return this.tasksRepository.save(task);
  }

  async remove(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({
      id,
      user: { id: user.id },
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async search(query: string, user: User): Promise<Task[]> {
    if (!query?.trim()) return this.findAll(user);

    // 1. Busca Semântica (por similaridade de significado)
    const searchVector = await this.aiService.generateEmbedding(query);
    let semanticResults: SemanticSearchResult[] = [];
    if (searchVector && Array.isArray(searchVector) && searchVector.length) {
      const vectorString = `[${searchVector.join(',')}]`;
      // Usamos query crua para performance e compatibilidade com operadores do pgvector
      semanticResults = await this.tasksRepository.manager.query(
        `
        SELECT *, "embedding" <=> $1 AS distance
        FROM "task"
        WHERE "userId" = $2
        ORDER BY distance ASC
        LIMIT 5
        `,
        [vectorString, user.id],
      );
    }

    // 2. Busca Textual (por palavras-chave no título ou descrição)
    const textualResults = await this.tasksRepository
      .createQueryBuilder('task')
      .where('task."userId" = :userId', { userId: user.id })
      .andWhere('(task.title ILIKE :query OR task.description ILIKE :query)', {
        query: `%${query}%`,
      })
      .limit(5)
      .getMany();

    // 3. Combina e Remove Duplicatas
    const combinedResults: (Task | SemanticSearchResult)[] = [
      ...semanticResults,
      ...textualResults,
    ];
    const uniqueResultsMap = new Map<string, Task>();
    combinedResults.forEach((task) => {
      if (task) {
        uniqueResultsMap.set(task.id, task as Task);
      }
    });

    return Array.from(uniqueResultsMap.values());
  }
}

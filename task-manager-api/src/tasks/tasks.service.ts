import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { AiService } from '../ai/ai.service';

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
    return this.tasksRepository.find({ where: { user: { id: user.id } } });
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

  // MÉTODO SEARCH CORRIGIDO
  async search(query: string, user: User): Promise<Task[]> {
    const searchVector = await this.aiService.generateEmbedding(query);

    if (!searchVector) {
      return [];
    }

    // A pgvector espera o vetor no formato '[1,2,3,...]'
    const vectorString = `[${searchVector.join(',')}]`;

    // Usamos o QueryBuilder para construir a query de forma segura
    const tasks = await this.tasksRepository
      .createQueryBuilder('task')
      // Adicionamos um campo virtual 'distance' calculado com a distância de cosseno.
      // O operador `<=>` é do pgvector.
      .addSelect('task.embedding <=> :vector', 'distance')
      // Filtramos para pegar apenas as tarefas do usuário logado
      .where('task."userId" = :userId', { userId: user.id })
      // Passamos o vetor de busca como um parâmetro seguro para evitar SQL Injection
      .setParameter('vector', vectorString)
      // Ordenamos pela distância (menor distância = mais similar)
      .orderBy('distance', 'ASC')
      // Limitamos o número de resultados
      .limit(5)
      // O TypeORM mapeará os resultados para a entidade Task automaticamente
      .getMany();

    return tasks;
  }
}

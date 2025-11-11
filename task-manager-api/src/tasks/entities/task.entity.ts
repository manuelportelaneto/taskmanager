import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  rawText: string | null;

  @Column({ type: 'varchar' }) // Usamos 'varchar' para títulos
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  // CORREÇÃO: Especificamos 'varchar' para a prioridade da IA.
  @Column({ type: 'varchar', nullable: true })
  aiPriority: string | null;

  @Column({ type: 'text', nullable: true })
  aiJustification: string | null;

  @Column({
    type: 'vector',
    length: 1536,
    nullable: true,
  })
  embedding: number[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}

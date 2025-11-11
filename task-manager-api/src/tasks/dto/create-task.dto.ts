import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // Propriedades da IA (opcionais no DTO, preenchidas pelo controller)
  @IsString()
  @IsOptional()
  aiPriority?: string;

  @IsString()
  @IsOptional()
  aiJustification?: string;

  // CORREÇÃO: Adicionamos a propriedade que faltava
  @IsString()
  @IsOptional()
  rawText?: string;
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

interface GeneratedTaskData {
  title: string;
  description: string;
  aiPriority: 'Alta' | 'Média' | 'Baixa';
  aiJustification: string;
}

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({ apiKey: configService.get<string>('OPENAI_API_KEY') });
  }

  async generateTaskFromText(text: string): Promise<GeneratedTaskData | null> {
    const systemPrompt = `Você é um assistente de produtividade de classe mundial. Sua única função é chamar a ferramenta 'create_task'. Se o texto do usuário for muito vago ou não parecer uma tarefa, use 'Não especificado' para o título e a descrição. NUNCA retorne argumentos vazios.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'create_task',
              description: 'Cria uma nova tarefa a partir do texto do usuário.',
              parameters: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  priority: { type: 'string', enum: ['Alta', 'Média', 'Baixa'] },
                  justification: { type: 'string' },
                },
                required: ['title', 'description', 'priority', 'justification'],
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'create_task' } },
      });

      const toolCall = response.choices[0]?.message?.tool_calls?.[0] as any;

      const toolName = toolCall?.name ?? toolCall?.tool?.name;
      const toolArgsRaw = toolCall?.arguments ?? toolCall?.tool?.arguments;

      if (toolName === 'create_task' && toolArgsRaw) {
        const args = JSON.parse(toolArgsRaw);
        if (args && args.title && args.description) {
          return {
            title: args.title,
            description: args.description,
            aiPriority: args.priority || 'Média',
            aiJustification: args.justification || 'Não especificado.',
          };
        }
      }

      console.error('AI response did not contain the expected function call or required fields.');
      return null;
    } catch (error) {
      console.error('Error in generateTaskFromText:', error);
      throw new InternalServerErrorException('Failed to generate task from AI.');
    }
  }

  async generateEmbedding(text: string): Promise<number[] | null> {
    if (!text) return null;
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.replace(/\n/g, ' '),
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error calling OpenAI API for embeddings:', error);
      throw new InternalServerErrorException('Failed to generate embedding from AI.');
    }
  }
}
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageToolCall } from 'openai/resources/chat'; // Import necessário

// Interface para definir o retorno esperado
interface GeneratedTaskData {
  title: string;
  description: string;
  aiPriority: 'Alta' | 'Média' | 'Baixa';
  aiJustification: string;
}

// Interface para os argumentos da função da ferramenta
interface CreateTaskToolArguments {
  title: string;
  description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  justification: string;
}

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateTaskFromText(text: string): Promise<GeneratedTaskData | null> {
    const systemPrompt = `Você é um assistente de produtividade de classe mundial. Sua única função é chamar a ferramenta 'create_task'.

Exemplo 1:
Usuário: "Ligar para o cliente João amanhã para discutir o contrato."
Assistente: (Chama create_task com title="Ligar para cliente João", description="Discutir detalhes do contrato e agendar retorno.", priority="Média", justification="Importância de cliente e contrato.")

Exemplo 2:
Usuário: "preciso de algo"
Assistente: (Chama create_task com title="Não especificado", description="O texto do usuário é muito vago.", priority="Baixa", justification="Texto vago e sem ação clara.")

SEMPRE chame a ferramenta 'create_task'. Garanta que os argumentos NUNCA estejam vazios (e sim com 'Não especificado' ou um valor padrão).`;

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
                  priority: {
                    type: 'string',
                    enum: ['Alta', 'Média', 'Baixa'],
                  },
                  justification: { type: 'string' },
                },
                required: ['title', 'description', 'priority', 'justification'],
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'create_task' } },
      });

      const toolCall = response.choices[0]?.message?.tool_calls?.[0];

      if (toolCall?.type === 'function' && toolCall.function.name === 'create_task') {
        try {
          const args: CreateTaskToolArguments = JSON.parse(
            toolCall.function.arguments,
          );

          if (args && args.title && args.description) {
            return {
              title: args.title,
              description: args.description,
              aiPriority: args.priority || 'Média',
              aiJustification:
                args.justification || 'Análise da IA inconclusiva.',
            };
          }
        } catch (e) {
          console.error('Failed to parse tool call arguments:', e);
        }
      }
      return null;
    } catch (error) {
      console.error('Error in generateTaskFromText:', error);
      throw new InternalServerErrorException(
        'Failed to generate task from AI.',
      );
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
      throw new InternalServerErrorException(
        'Failed to generate embedding from AI.',
      );
    }
  }
}

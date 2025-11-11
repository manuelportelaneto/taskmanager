import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Importa o ValidationPipe
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para permitir que o frontend se comunique com a API
  app.enableCors();

  // Habilita um Pipe de Validação global.
  // Isso faz com que todos os DTOs em toda a aplicação
  // sejam validados automaticamente usando 'class-validator'.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO
      transform: true, // Tenta transformar os payloads para os tipos do DTO
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('API para gerenciamento de tarefas com IA')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

// O `void` na frente é uma boa prática para lidar com promises "flutuantes". Está correto.
void bootstrap();

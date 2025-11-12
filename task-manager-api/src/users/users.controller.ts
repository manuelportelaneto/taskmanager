import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  // CORREÇÃO: Restaurado o construtor para injetar o serviço.
  constructor(private readonly usersService: UsersService) {}

  // CORREÇÃO: Restaurada a rota POST para criar o usuário.
  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

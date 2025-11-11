import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  // CORREÇÃO: Restaurado o construtor para injetar o serviço.
  constructor(private readonly usersService: UsersService) {}

  // CORREÇÃO: Restaurada a rota POST para criar o usuário.
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
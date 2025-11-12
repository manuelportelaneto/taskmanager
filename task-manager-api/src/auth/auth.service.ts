import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    console.log('Attempting to validate user:', { email });
    const user = await this.usersService.findByEmail(email);
    console.log('Usuário encontrado:', user);

    if (!user) {
      console.log('Usuário não encontrado para o email:', email);
      return null;
    }

    console.log('Comparando senhas:', {
      providedPassword: pass,
      storedHash: user.password,
    });
    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    console.log('Resultado da comparação:', isPasswordMatching);
    if (isPasswordMatching) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

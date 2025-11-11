import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service'; // Importamos o UsersService
import { User } from '../users/entities/user.entity'; // Importamos a entidade User

// Definimos a interface JwtPayload localmente para evitar dependência de um arquivo externo ausente.
export interface JwtPayload {
  sub: string | number;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // CORREÇÃO: Injetamos o UsersService para podermos consultar o banco.
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error(
        'FATAL ERROR: JWT_SECRET is not defined in environment variables.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Este método agora busca o usuário completo no banco de dados.
   * Isso garante que o usuário existe e nos dá acesso à entidade completa
   * nos controllers, através do decorator @GetUser().
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { sub: userId } = payload;
    const user = await this.usersService.findOne(String(userId)); // Buscamos o usuário pelo ID do token

    if (!user) {
      // Se o usuário não existir mais, o token é inválido.
      throw new UnauthorizedException('User not found.');
    }

    return user; // O objeto 'user' completo será anexado a req.user
  }
}
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Interface para definir o formato do payload do JWT
export interface JwtPayload {
  sub: string; // O ID do usuário (subject)
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    // Fail-fast: A aplicação não deve iniciar sem uma chave JWT.
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
   * O Passport decodifica o JWT usando a chave secreta.
   * Este método `validate` então recebe o payload decodificado como argumento.
   * O que este método retorna será anexado ao objeto `request` como `req.user`.
   * @param payload O payload decodificado do token JWT.
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Para nosso caso, o próprio payload contém as informações do usuário que precisamos.
    // Em um sistema mais complexo, poderíamos usar o `payload.sub` (ID do usuário)
    // para buscar a entidade `User` completa no banco de dados aqui.
    return { sub: payload.sub, email: payload.email };
  }
}

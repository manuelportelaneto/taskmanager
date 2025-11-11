import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any): any {
    if (err || !user) {
      throw (
        err || new UnauthorizedException('Token is invalid or has expired.')
      );
    }
    return user;
  }
}

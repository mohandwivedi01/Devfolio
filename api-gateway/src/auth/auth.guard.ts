import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom, Observable } from 'rxjs';

interface JwtPayload {
  id: string;
}

export interface RequestWithUser extends Request {
  userId: string;
  email?: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    private readonly JwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const token: string | null = request.headers['authorization']
      ? request.headers['authorization'].split(' ')[1]
      : null;

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const decoded = this.JwtService.verify<JwtPayload>(token);
      const user: any = await firstValueFrom(
        this.userService.send({ cmd: 'validateUser' }, {
          userId: decoded.id,
          token: token,
        }),
      );

      request.userId = user.id;
      request.email = user.email;

      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException('Invalid or expired token.');
      }
      throw new UnauthorizedException('Invalid token.');
    }
  }
}

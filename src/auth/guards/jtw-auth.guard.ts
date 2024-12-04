import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [, token] = authHeader.split(' ');
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const user = this.jwtService.verify(token, { algorithms: ['HS256'] });
      request.user = user;
      return true;
    } catch (error) {
      console.error('Token Verification Error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}

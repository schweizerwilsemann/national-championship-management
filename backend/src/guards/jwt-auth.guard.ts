import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '@/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // Kiểm tra nếu route có @Public() thì bỏ qua xác thực
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    let token: string | null = null;

    // Ưu tiên lấy token từ Cookie
    if (request.cookies && request.cookies['access_token']) {
      token = request.cookies['access_token'];
    }
    // Nếu không có trong Cookie, kiểm tra trong Authorization Header
    else {
      const authHeader = request.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    // Nếu không tìm thấy token, từ chối truy cập
    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      // Giải mã token
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload; // Gán user vào request để sử dụng trong RolesGuard
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

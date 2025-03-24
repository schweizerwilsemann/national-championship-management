import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '@/decorators/public.decorator';
import { ROLES_KEY } from '@/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('🔹 RolesGuard activated');

    const request: Request = context.switchToHttp().getRequest();

    // 1️⃣ Bỏ qua kiểm tra nếu route có @Public()
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      console.log('✅ Route is public, skipping authentication');
      return true;
    }

    // 2️⃣ Kiểm tra required roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log('🔹 Required Roles:', requiredRoles);

    // 3️⃣ Lấy token từ Cookie hoặc Authorization Header
    let token: string | null = null;

    if (request.cookies && request.cookies['access_token']) {
      token = request.cookies['access_token'];
    } else if (request.headers.authorization?.startsWith('Bearer ')) {
      token = request.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('❌ No valid token found');
      throw new ForbiddenException('Access token is required');
    }

    console.log('🔹 Extracted Token:', token);

    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log('✅ Decoded JWT Payload:', payload);

      request['user'] = payload;

      // 4️⃣ Nếu route không có @Roles() => Không cần kiểm tra vai trò
      if (!requiredRoles) {
        console.log('✅ No roles required, allowing access');
        return true;
      }

      console.log('🔹 Checking Role:', payload.role);
      const hasRole = requiredRoles.some((role) => payload.role.includes(role));

      if (!hasRole) {
        console.log('❌ User does not have required roles');
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }

      return true;
    } catch (error) {
      console.error('❌ JWT Verification Error:', error);
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}

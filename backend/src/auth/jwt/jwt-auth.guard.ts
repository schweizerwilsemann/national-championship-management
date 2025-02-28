import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.cookies['access_token']; // Get the token from the cookie

    if (!token) {
      return false; // No token found
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.body = payload; // Attach user payload to request
      return true; // Token is valid
    } catch (error) {
      return false; // Token is invalid
    }
  }
}

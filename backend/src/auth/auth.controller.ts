import { Controller, Post, Get, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Response } from 'express';
import { RegisterDto } from './dtos/register.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    const result = await this.authService.login(loginDto, response);
    return result;
  }
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return result;
  }
  @Post('logout')
  async logout(@Res() response: Response) {
    response.clearCookie('access_token');
    response.json('Logout successfully');
  }
  @Get('check-cookie')
  checkCookie(@Req() req: Request) {
    return req.cookies?.access_token || 'No cookie found';
  }
}

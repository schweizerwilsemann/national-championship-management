import { Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service'; // Adjust the import path as necessary
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user?: User; message: string; statusCode: number }> {
    const { email, password, name, role = 'USER' } = registerDto; // Gán mặc định là 'USER'

    // Check if the email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { message: 'Email already in use', statusCode: 409 };
    }

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword, name, role },
      });

      return { user, message: 'User registered successfully', statusCode: 201 };
    } catch (error) {
      console.error('Register Error:', error);

      if (error.code === 'P2002') {
        return { message: 'Email already in use', statusCode: 409 };
      }

      return { message: 'Internal server error', statusCode: 500 };
    }
  }
  async profile(@Req() request: any, @Res() response: Response): Promise<void> {
    try {
      // Get token from cookie or Authorization header
      const token =
        request.cookies?.access_token ||
        request.headers?.authorization?.split(' ')[1];

      if (!token) {
        throw new Error('No token provided');
      }

      // Xác thực token
      const decoded = this.jwtService.verify(token);

      // Tìm user theo id từ token
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      response.json({
        statusCode: 200,
        user,
      });
    } catch (error) {
      response.status(401).json({
        statusCode: 401,
        message: 'Invalid or expired token',
      });
    }
  }
  async login(loginDto: LoginDto, @Res() response: Response): Promise<void> {
    const { email, password } = loginDto;

    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      response.status(401).json({ statusCode: 401, message: 'User not found' });
      return; // Ensure to return after sending response
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
      response
        .status(401)
        .json({ statusCode: 401, message: 'Invalid password' });
      return; // Ensure to return after sending response
    }

    // Generate JWT token
    const accessToken = this.jwtService.sign({
      id: user?.id,
      email: user?.email,
      role: user?.role,
    });

    // Set cookie
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: response.req.protocol === 'https',
      maxAge: 86400000, // 1 day
    });

    response.json({
      statusCode: 200,
      accessToken,
      user: { id: user.id, email: user.email, role: user.role },
    });
  }
}

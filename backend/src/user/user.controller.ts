import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UUIDValidationPipe } from '@/pipes/uuid-validation.pipe';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { Roles } from '@/decorators/roles.decorator';

// Type for user without password
type UserWithoutPassword = Omit<User, 'password'>;

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('ADMIN')
  async getAllUsers(): Promise<UserWithoutPassword[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @Roles('ADMIN')
  @UsePipes(UUIDValidationPipe)
  async getUserById(@Param('id') id: string): Promise<UserWithoutPassword> {
    return this.userService.getUserById(id);
  }

  @Post()
  @Roles('ADMIN')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserWithoutPassword> {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @Roles('ADMIN')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Put('update/:id')
  @Roles('ADMIN', 'ORGANIZER')
  async updateCurrentUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UsePipes(UUIDValidationPipe)
  async softDeleteUser(
    @Param('id') id: string,
  ): Promise<{ id: string; message: string }> {
    return this.userService.softDeleteUser(id);
  }

  @Post(':id/restore')
  @Roles('ADMIN')
  @UsePipes(UUIDValidationPipe)
  async restoreUser(@Param('id') id: string): Promise<UserWithoutPassword> {
    return this.userService.restoreUser(id);
  }

  @Get('deleted/all')
  @Roles('ADMIN')
  async getDeletedUsers(): Promise<{ id: string; deletedAt: Date }[]> {
    return this.userService.getDeletedUsers();
  }

  @Delete(':id/hard')
  @Roles('ADMIN')
  @UsePipes(UUIDValidationPipe)
  async hardDeleteUser(
    @Param('id') id: string,
  ): Promise<{ id: string; message: string }> {
    return this.userService.hardDeleteUser(id);
  }
}

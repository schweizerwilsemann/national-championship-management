import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';

// Interface for soft-deleted users (stored in memory)
interface DeletedUser {
  id: string;
  deletedAt: Date;
}

// Interface for user without password
type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UserService {
  // In-memory store for soft-deleted users
  private deletedUsers: Map<string, Date> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<UserWithoutPassword[]> {
    // Get all users except those in our deleted list
    const users = await this.prisma.user.findMany();

    // Filter out soft-deleted users and remove passwords
    return users
      .filter((user) => !this.deletedUsers.has(user.id))
      .map(
        ({ password, ...userWithoutPassword }) =>
          userWithoutPassword as UserWithoutPassword,
      );
  }

  async getUserById(id: string): Promise<UserWithoutPassword> {
    // Check if user is soft-deleted
    if (this.deletedUsers.has(id)) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserWithoutPassword;
  }

  async getUserByEmail(email: string): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || this.deletedUsers.has(user.id)) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserWithoutPassword;
  }

  async createUser(data: CreateUserDto): Promise<UserWithoutPassword> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser && !this.deletedUsers.has(existingUser.id)) {
      throw new ConflictException(
        `User with email ${data.email} already exists`,
      );
    }

    // If user exists but is soft-deleted, we can reuse the email
    if (existingUser && this.deletedUsers.has(existingUser.id)) {
      // Remove from deleted list if we're reusing the email
      this.deletedUsers.delete(existingUser.id);

      // Update the existing user instead of creating a new one
      return this.updateUser(existingUser.id, data);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserWithoutPassword;
  }

  async updateUser(
    id: string,
    data: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    // Check if user exists and is not soft-deleted
    await this.getUserById(id);

    // If email is being updated, check if it's already in use
    if (data.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (
        existingUser &&
        existingUser.id !== id &&
        !this.deletedUsers.has(existingUser.id)
      ) {
        throw new ConflictException(
          `User with email ${data.email} already exists`,
        );
      }
    }

    // If password is being updated, hash it
    let updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as UserWithoutPassword;
  }

  async softDeleteUser(id: string): Promise<{ id: string; message: string }> {
    // Check if user exists and is not already soft-deleted
    await this.getUserById(id);

    // Add to soft-deleted list
    this.deletedUsers.set(id, new Date());

    return {
      id,
      message: `User with ID ${id} has been soft-deleted`,
    };
  }

  async restoreUser(id: string): Promise<UserWithoutPassword> {
    // Check if user exists in the database
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if user is soft-deleted
    if (!this.deletedUsers.has(id)) {
      throw new BadRequestException(`User with ID ${id} is not deleted`);
    }

    // Remove from soft-deleted list
    this.deletedUsers.delete(id);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserWithoutPassword;
  }

  async getDeletedUsers(): Promise<{ id: string; deletedAt: Date }[]> {
    const deletedUsersList: { id: string; deletedAt: Date }[] = [];

    this.deletedUsers.forEach((deletedAt, id) => {
      deletedUsersList.push({ id, deletedAt });
    });

    return deletedUsersList;
  }

  async hardDeleteUser(id: string): Promise<{ id: string; message: string }> {
    // Check if user exists (regardless of soft-delete status)
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Remove from soft-deleted list if present
    if (this.deletedUsers.has(id)) {
      this.deletedUsers.delete(id);
    }

    // Permanently delete the user
    await this.prisma.user.delete({
      where: { id },
    });

    return {
      id,
      message: `User with ID ${id} has been permanently deleted`,
    };
  }
}

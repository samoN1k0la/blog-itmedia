import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
    });
    return await this.userRepository.save(newUser);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: User[], total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    users.forEach(user => delete user.password);
    return { users, total };
  }

  async getUserById(id: string, userReq: User) {
    if (userReq.id == parseInt(id) || userReq.role == 'admin') {
      const userId = parseInt(id, 10);
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      delete user.password;
      return user;
    } else {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, userReq: User) {
    const user = await this.getUserById(id, userReq);
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    Object.assign(user, updateUserDto, { updatedAt: new Date() });
    return await this.userRepository.save(user);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const isPasswordMatching = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('New password and confirmation do not match');
    }

    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedNewPassword;

    return this.userRepository.save(user);
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.userRepository.createQueryBuilder('user')
        .where('user.username LIKE :query OR user.email LIKE :query', { query: `%${query}%` })
        .getMany();
  }
}

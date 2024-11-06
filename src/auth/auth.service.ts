import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../api/users/dto/create-user.dto';
import { UsersService } from '../api/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
        throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.createUser({
        ...createUserDto,
        password: hashedPassword,
    });
    
    delete user.password;
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { id: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, { algorithm: 'HS256' }),
    };
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../api/users/dto/create-user.dto';
import { LoginUserDto } from '../api/users/dto/login-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user. Uses CreateUserDto schema.' })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user. Uses LoginUserDto schema.' })
  async login(@Body() LoginUserDto: LoginUserDto) {
    const { email, password } = LoginUserDto;
    return this.authService.login(email, password);
  }
}

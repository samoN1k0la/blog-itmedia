import { Controller, Get, Put, Param, Body, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
//import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getAllUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.usersService.getAllUsers(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  //@UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID. Uses UpdateUserDto schema.' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }
}

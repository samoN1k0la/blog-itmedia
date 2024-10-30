import { Controller, Get, Put, Param, Body, Query, UseGuards, Request, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jtw-auth.guard';
import { Roles } from '../../auth/guards/roles.decorator';
import { Role } from '../../auth/guards/role.enum';


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

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Author)
  @ApiOperation({ summary: 'Update user by ID. Uses UpdateUserDto schema.' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req: any) {
    const user = req.user;
    return this.usersService.updateUser(id, updateUserDto, user);
  }
}

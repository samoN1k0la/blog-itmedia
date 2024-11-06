import { Controller, Get, Put, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jtw-auth.guard';
import { Roles } from '../../auth/guards/roles.decorator';
import { Role } from '../../auth/guards/role.enum';
import { ChangePasswordDto } from './dto/change-password.dto';


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for users by name or email' })
  searchUsers(@Query('query') query: string) {
      return this.usersService.searchUsers(query);
  }

  @Put('pass')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Author)
  @ApiOperation({ summary: 'Change user password' })
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req: any) {
      const user = req.user;
      return this.usersService.changePassword(user.id, changePasswordDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all users' })
  getAllUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.usersService.getAllUsers(page, limit);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Author)
  @ApiOperation({ summary: 'Get user by ID' })
  getUserById(@Param('id') id: string, @Request() req: any) {
    const user = req.user;
    return this.usersService.getUserById(id, user);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Author)
  @ApiOperation({ summary: 'Update user by ID. Uses UpdateUserDto schema.' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req: any) {
    const user = req.user;
    return this.usersService.updateUser(id, updateUserDto, user);
  }
}

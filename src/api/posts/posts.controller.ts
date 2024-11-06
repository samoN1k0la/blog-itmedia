import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jtw-auth.guard';
import { Role } from 'src/auth/guards/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  getAllPosts(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.postsService.getAllPosts(page, limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for posts by title or content' })
  searchPosts(@Query('query') query: string) {
      return this.postsService.searchPosts(query);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Author)
  @ApiOperation({ summary: 'Create a new post' })
  createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    const user = req.user;
    return this.postsService.createPost(createPostDto, user);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Author)
  @ApiOperation({ summary: 'Update a post' })
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Request() req: any) {
    const user = req.user;
    return this.postsService.updatePost(id, updatePostDto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Author)
  @ApiOperation({ summary: 'Delete a post' })
  deletePost(@Param('id') id: string, @Request() req: any) {
    const user = req.user;
    return this.postsService.deletePost(id, user);
  }
}

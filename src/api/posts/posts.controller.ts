import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  getAllPosts(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.postsService.getAllPosts(page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}

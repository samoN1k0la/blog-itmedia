import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UseGuards, 
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, Multer } from 'multer';
import { extname, join } from 'path';
import * as sharp from 'sharp';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
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

  @Post('upload-image')
  @ApiOperation({ summary: 'Upload image for blog post' })
  @UseInterceptors(FileInterceptor('image', {  
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = extname(file.originalname);
        callback(null, `original-${uniqueSuffix}${extension}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadImage(@UploadedFile() file: Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filename = `resized-${Date.now()}.webp`;
    const outputPath = join('./uploads', filename);
    const originalPath = join('./uploads', file.filename);

    try {
      await sharp(file.path)
        .resize(640)
        .webp({ quality: 80 })
        .toFile(outputPath);

      unlinkSync(originalPath);

      return { imageUrl: `http://localhost:4000/uploads/${filename}` };
    } catch (error) {
      console.error('Image processing error:', error);
      throw new BadRequestException('Image processing failed');
    }
  } 

  @Get('search')
  @ApiOperation({ summary: 'Search for posts by title or content' })
  searchPosts(@Query('query') query: string) {
      return this.postsService.searchPosts(query);
  }

  @Get('my-posts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get posts for the authenticated author' })
  async getMyPosts(
    @Request() req: any, 
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10
  ) {
    const user = req.user;
    return this.postsService.getPostsByAuthor(user.id, page, limit);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Author)
  @ApiOperation({ summary: 'Create a new post' })
  createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    const user = req.user;
    console.log(user);
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

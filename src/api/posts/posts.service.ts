import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import e from 'express';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getAllPosts(page: number = 1, limit: number = 10): Promise<{ posts: Post[], total: number }> {
    const [posts, total] = await this.postRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { posts, total };
  }

  async createPost(createPostDto: CreatePostDto, userReq: any): Promise<Post> {
    if (userReq.id == createPostDto.author_id || userReq.role == 'admin') {
      const newPost = this.postRepository.create(createPostDto);
      return this.postRepository.save(newPost);
    } else {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto, userReq: any): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: +id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (userReq.id == post.author_id || userReq.role == 'admin') {
      const post = await this.postRepository.findOne({ where: { id: +id } });
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      Object.assign(post, updatePostDto);
      return this.postRepository.save(post);
    } else {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }
  }

  async deletePost(id: string, userReq: any): Promise<{ message: string }> {
    const post = await this.postRepository.findOne({ where: { id: +id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (userReq.id == post.author_id || userReq.role == 'admin') {
      await this.postRepository.remove(post);
      return { message: 'Post deleted successfully' };
    } else {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }
  }

  async searchPosts(query: string): Promise<Post[]> {
    return this.postRepository.createQueryBuilder('post')
        .where('post.title LIKE :query OR post.content LIKE :query', { query: `%${query}%` })
        .getMany();
  }
}

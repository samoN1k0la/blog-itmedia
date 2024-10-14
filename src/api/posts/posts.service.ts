import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  private posts = []; // Mock data

  getAllPosts() {
    return this.posts;
  }

  createPost(createPostDto: CreatePostDto) {
    const newPost = {
      id: Date.now().toString(),
      ...createPostDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  updatePost(id: string, updatePostDto: UpdatePostDto) {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    const updatedPost = {
      ...this.posts[postIndex],
      ...updatePostDto,
      updatedAt: new Date(),
    };
    this.posts[postIndex] = updatedPost;
    return updatedPost;
  }

  deletePost(id: string) {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    this.posts.splice(postIndex, 1);
    return { message: 'Post deleted successfully' };
  }
}

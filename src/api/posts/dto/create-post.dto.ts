import { IsNotEmpty, IsNumber, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My first post',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is my first post',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The id of the author',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  author_id: number;

  @ApiProperty({
    description: 'Status of the post',
    example: 'Draft',
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    description: 'The hero image URL of the post',
    example: 'https://example.com/image.png',
  })
  @IsNotEmpty()
  @IsString()
  hero_url: string;
}

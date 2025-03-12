import { IsString, IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My first post',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is my first post',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'The status of the post',
    example: 'Draft',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'The hero image URL of the post',
    example: 'https://example.com/image.png',
  })
  @IsOptional()
  @IsString()
  hero_url?: string;
}

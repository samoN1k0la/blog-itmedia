import { IsOptional, IsEmail, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../auth/guards/role.enum';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'strongPassword123',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  role: Role;
}

import { IsNotEmpty, IsString, MinLength, Matches } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The current password of the user',
    example: 'currentPassword123',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'The new password for the user',
    example: 'newPassword123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'New password is too short. Minimum length is 8 characters.' })
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/, {
    message: 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Confirm the new password',
    example: 'newPassword123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Confirmed password is too short. Minimum length is 8 characters.' })
  confirmPassword: string;
}

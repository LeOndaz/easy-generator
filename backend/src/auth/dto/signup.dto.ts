import { PickType } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignUpDto extends PickType(User, ['email', 'password']) {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
    message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;
} 
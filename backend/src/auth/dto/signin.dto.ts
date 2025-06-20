import { PickType } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto extends PickType(User, ['email', 'password']) {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
} 
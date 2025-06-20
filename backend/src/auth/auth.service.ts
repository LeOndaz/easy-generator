import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import * as argon2 from 'argon2';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { InvalidCredentialsError, EmailAlreadyExistsError } from './errors';

@Injectable()
export class  AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (!user || !(await argon2.verify(user.password, signInDto.password))) {
      throw new InvalidCredentialsError();
    }
    return this.generateTokens(user);
  }

  async signUp(signUpDto: SignUpDto): Promise<SignInResponseDto> {
    const existingUser = await this.usersService.findOneByEmail(
      signUpDto.email,
    );

    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    const hashedPassword = await argon2.hash(signUpDto.password);
    const user = await this.usersService.create({
      email: signUpDto.email,
      password: hashedPassword,
    });

    return this.generateTokens(user);
  }

  private async generateTokens(user: UserDocument) {
    const payload = { sub: user._id };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);

    const { password, ...userResult } = user.toObject();

    return {
      accessToken,
      refreshToken,
      user: userResult,
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findOneById(payload.sub);
      if (!user) {
        throw new InvalidCredentialsError('User from token not found');
      }

      const newAccessToken = await this.jwtService.signAsync(
        { sub: user._id },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        },
      );

      return { accessToken: newAccessToken };
    } catch (e) {
      if (e instanceof InvalidCredentialsError) throw e;
      throw new InvalidCredentialsError('Invalid or expired refresh token');
    }
  }
}

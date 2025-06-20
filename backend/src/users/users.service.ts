import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(user: Partial<User>): Promise<UserDocument> {
    return this.usersRepository.create(user);
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.usersRepository.findOne({ email });
  }

  async findOneById(id: string): Promise<UserDocument | null> {
    return this.usersRepository.findOne({ _id: id });
  }
}

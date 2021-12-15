import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) { }

  async findOne(userId: string): Promise<User> {
    return this.usersRepository.findOne(userId);
  }

  async findOneByFields(params: Object): Promise<User> {
    return this.usersRepository.findOne(params);
  }

  create(partialEntity: Object): User {
    return this.usersRepository.create(partialEntity);
  }

  async save<T>(user: T): Promise<T> {
    return this.usersRepository.save(user);
  }

}
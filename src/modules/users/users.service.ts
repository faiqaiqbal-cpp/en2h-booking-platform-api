import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });
  }

  create(email: string, passwordHash: string): Promise<User> {
    const user = this.usersRepository.create({
      email: email.trim().toLowerCase(),
      passwordHash,
    });

    return this.usersRepository.save(user);
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreateUserDto } from './DTO/create-user.dto';
import { user } from './user.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(user)
        private userRepository: Repository<user>,
      ) {}
    
      async findAll(): Promise<user[]> {
        return await this.userRepository.find();
      }

      createUser(user: CreateUserDto){
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
      }
}

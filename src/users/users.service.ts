import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreateUserDto } from './DTO/create-user.dto';
import { user } from './user.entity';
import * as argon2 from 'argon2';

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

      async register(userObject : CreateUserDto){
        const {password} = userObject;
        const plainToHash = await argon2.hash(password);
        const hexPassword = plainToHash;
        userObject = {...userObject,password:hexPassword};

        return this.userRepository.save(userObject);

    
   }
}


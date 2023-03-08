import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreateUserDto } from './DTO/create-user.dto';
import { user } from './user.entity';
import * as argon2 from 'argon2';
import { LoginUserDto } from './DTO/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(user) private userRepository: Repository <user>, 
    private jwtService: JwtService){}
    
      async findAll(): Promise<user[]> {
        return await this.userRepository.find();
      }

      async getUserById(id:number): Promise<user>{
        return await this.userRepository.findOne({where: {IdUsuario: id}})
      }

      async register(userObject : CreateUserDto){
        const {password} = userObject;
        const plainToHash = await argon2.hash(password);
        const hexPassword = plainToHash;
        userObject = {...userObject,password:hexPassword};

        return this.userRepository.save(userObject);
  
   }

   async login(userObjectLogin: LoginUserDto){
    const{username,password} = userObjectLogin; //http
    const findUser = await this.userRepository.findOne({where : {username}});
    if(!findUser) throw new HttpException('USER NOT FOUND' , 404);

    const validatePassword = await argon2.verify(findUser.password, password);

    if(!validatePassword) throw new HttpException('PASSWORD INCORRECT', 403);

    const payload = {IdUsuario:findUser.IdUsuario, name : findUser.username, IdRol: findUser.IdRol};
    const token = this.jwtService.sign(payload);

    const data = {
        user: findUser, token,
    };

    console.log(payload)
    return data;


   }
}


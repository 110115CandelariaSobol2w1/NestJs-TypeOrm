import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './DTO/create-user.dto';
import { LoginUserDto } from './DTO/login-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService){}
    
    @Get()
    obtenerUsuarios(){
        return this.userService.findAll();
    }

    @Post()
    createUser(@Body() newUser:CreateUserDto){
        return this.userService.register(newUser);
    }

    @Post('login')
    loginUser(@Body() userObjectLogin:LoginUserDto){
        return this.userService.login(userObjectLogin);
    }

}

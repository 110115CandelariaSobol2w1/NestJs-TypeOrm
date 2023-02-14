import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {JwtModule} from '@nestjs/jwt';
import {jwtConstanst } from './JWT/jwt.constants';
import { JwtStrategy } from './JWT/jwt.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([user]),
  JwtModule.register({
    secret : jwtConstanst.secret,
    signOptions : {expiresIn : '1h'}
  })],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy]
})
export class UsersModule {}

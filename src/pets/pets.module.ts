import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/users/JWT/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { pet } from './pet.entity';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

@Module({
  imports:[TypeOrmModule.forFeature([pet]), UsersModule, JwtModule],
  controllers: [PetsController],
  providers: [PetsService, JwtStrategy]
})
export class PetsModule {}

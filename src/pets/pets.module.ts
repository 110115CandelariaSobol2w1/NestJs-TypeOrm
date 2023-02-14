import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/users/JWT/jwt.strategy';
import { pet } from './pet.entity';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

@Module({
  imports:[TypeOrmModule.forFeature([pet])],
  controllers: [PetsController],
  providers: [PetsService, JwtStrategy]
})
export class PetsModule {}

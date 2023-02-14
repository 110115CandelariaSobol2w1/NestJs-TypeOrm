import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pet } from './pet.entity';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

@Module({
  imports:[TypeOrmModule.forFeature([pet])],
  controllers: [PetsController],
  providers: [PetsService]
})
export class PetsModule {}

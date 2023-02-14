import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createConnection } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreatePetDto } from './DTO/create-pet.dto';
import { pet } from './pet.entity';

@Injectable()
export class PetsService {
    constructor(
        @InjectRepository(pet)
        private petsRepository: Repository<pet>,
      ) {}
    
      async findAll(): Promise<pet[]> {
        return await this.petsRepository.find();
      }

      createPet(pet: CreatePetDto){
        const newPet = this.petsRepository.create(pet);
        return this.petsRepository.save(newPet);
      }



}

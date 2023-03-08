import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createConnection } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreatePetDto } from './DTO/create-pet.dto';
import { pet } from './pet.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

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


      async paginate(options: IPaginationOptions): Promise<Pagination<pet>> {
        const queryBuilder = this.petsRepository.createQueryBuilder('c');
        queryBuilder.orderBy('IdMascota'); 
    
        return paginate<pet>(queryBuilder, options);
      }


      //obtenemos mascotas por id de cliente
      async obtenerMascotasCliente(IdUsuario: number): Promise<pet[]> {
        return this.petsRepository.find({ where: { IdCliente: IdUsuario } });
      }

      async getPetById(id:number): Promise<pet>{
        return await this.petsRepository.findOne({where: {IdMascota: id}})
      }

    


}

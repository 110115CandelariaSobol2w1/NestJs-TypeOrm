import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePetDto } from './DTO/create-pet.dto';
import { PetsService } from './pets.service';

@Controller('pets')
export class PetsController {


    constructor(private petService:PetsService){}
    
    @Get()
    obtenerMascotas(){
        return this.petService.findAll();
    }

    @Post()
    createPet(@Body() newPet: CreatePetDto){
        return this.petService.createPet(newPet);
    }
}

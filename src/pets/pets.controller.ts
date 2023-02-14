import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/users/JWT/jwt-auth.guards';
import { Roles } from 'src/users/JWT/roles.decorator';
import { CreatePetDto } from './DTO/create-pet.dto';
import { PetsService } from './pets.service';

@Controller('pets')
export class PetsController {


    constructor(private petService:PetsService){}
    
    @UseGuards(JwtAuthGuard)
    @Roles('1')
    @Get()
    obtenerMascotas(){
        return this.petService.findAll();
    }


    @Post()
    createPet(@Body() newPet: CreatePetDto){
        return this.petService.createPet(newPet);
    }
}

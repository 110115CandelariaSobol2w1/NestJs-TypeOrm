import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from 'src/users/JWT/jwt-auth.guards';
import { Roles } from 'src/users/JWT/roles.decorator';
import { CreatePetDto } from './DTO/create-pet.dto';
import { pet } from './pet.entity';
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


    @UseGuards(JwtAuthGuard)
    @Roles('1')
    @Get('paginacion')
    async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
        ): Promise<Pagination<pet>> {
    limit = limit > 100 ? 100 : limit;
    return this.petService.paginate({
      page,
      limit,
      route: 'http://localhost:3000/pets/paginacion?page=2&limit=5',
    });
  }


  @Get('/usuarios/:IdCliente')
  async obtenerMascotasCliente(@Param('IdCliente') IdCliente: number): Promise<pet[]> {
    return this.petService.obtenerMascotasCliente(IdCliente);
  }

}

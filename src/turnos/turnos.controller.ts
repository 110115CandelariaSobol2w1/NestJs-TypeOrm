import { Controller, Get, Param, Post } from '@nestjs/common';
import { TurnosService } from './turnos.service';

@Controller('turnos')
export class TurnosController {

    constructor(private turnosService: TurnosService){}

    @Get('turnos')
    obtenerUsuarios(){
        return this.turnosService.findAll();
    }

    @Get()
    obtenerPsicologos(){
        return this.turnosService.findTurnosByMascota()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('mascotas/usuarios/:IdUsuario')
    obtenerMascotasUsuarios(@Param('IdUsuario') IdUsuario: number){
        return this.turnosService.verTurnos(IdUsuario);
    }

    @Post('cancelar/:IdTurno')
    cancelarTurnoById(@Param('IdTurno') IdTurno: number){
        return this.turnosService.cancelarTurno(IdTurno)
    }

    @Get('mascotas/historial/:IdMascota')
    obtenerMascotasTurnosHistorial(@Param('IdMascota') IdMascota: number){
        return this.turnosService.infoMascotaTurno(IdMascota);
    }
}

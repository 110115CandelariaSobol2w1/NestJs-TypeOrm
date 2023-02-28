import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { consultarTurnosDto } from './DTO/consultar-turnos.dto';
import { registrarTurnoDto } from './DTO/registrar-turno.dto';
import { terminarCitaDto } from './DTO/terminar-cita.dto';
import { turnosDisponiblesDto } from './DTO/turnos-disponibles.dto';
import { turno } from './turno.entity';
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

    //7
    @Get('/psicologos')
    consultarTurnos(@Body() turno : consultarTurnosDto) {
       return this.turnosService.consultarTurnos(turno)
      }


      //registrar turno
      @Post('/probando')
      registrarTurno(@Body()turno : registrarTurnoDto){
          return this.turnosService.register(turno)
          
          
      }

      //8
      @Post('/terminar')
      terminarCita(@Body() turno: terminarCitaDto){
        return this.turnosService.terminarCita(turno)
      }

      //2 - ver turnos disponibles
      @Get('/disponibles')
      consultarTurnosDisponibles(@Body() turno : turnosDisponiblesDto) {
         return this.turnosService.getHorariosDisponibles(turno)
        }


        @Get('tipoMascota/:IdMascota')
        obtenerTipo(@Param('IdMascota') IdMascota: number){
            return this.turnosService.tipoMascota(IdMascota)
        }
}

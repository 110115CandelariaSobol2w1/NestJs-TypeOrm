import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/users/JWT/jwt-auth.guards';
import { consultarTurnosDto } from './DTO/consultar-turnos.dto';
import { registrarTurnoDto } from './DTO/registrar-turno.dto';
import { terminarCitaDto } from './DTO/terminar-cita.dto';
import { turnosDisponiblesDto } from './DTO/turnos-disponibles.dto';
import { turno } from './turno.entity';
import { TurnosService } from './turnos.service';

@Controller('turnos')
export class TurnosController {
  constructor(private turnosService: TurnosService) {}


  @Get('turnos')
  obtenerUsuarios() {
    return this.turnosService.findAll();
  }

  @Get()
  obtenerPsicologos2() {
    return this.turnosService.findTurnosByMascota();
  }

  //1
  @UseGuards(AuthGuard('PsicoCliente'))
  @Get('/psicologos')
  obtenerPsicologos() {
    return this.turnosService.obtenerPsicologos();
  }

  //2 - ver turnos disponibles
  //@UseGuards(AuthGuard('PsicoCliente'))
  @Get('/disponibles')
  consultarTurnosDisponibles(@Body() turno: turnosDisponiblesDto) {
    return this.turnosService.getHorariosDisponibles(turno);
  }

  //3 - registrar turno
  @UseGuards(AuthGuard('PsicoCliente'))
  @Post('/registrando')
  registrarTurno2(@Body() turno: registrarTurnoDto) {
    return this.turnosService.nuevoTurno(turno)
  }

  
  //4 ver mis turnos
  @UseGuards(AuthGuard('PsicoCliente'))
  @Get('mascotas/usuarios/:IdUsuario')
  obtenerTurnoMascota(@Param('IdCliente') IdCliente: number) {
    return this.turnosService.obtenerTurnosMascotas(IdCliente);
  }

  //5 - cancelar una cita
  @UseGuards()
  @Post('cancelar/:IdTurno')
  cancelarTurnoById(@Param('IdTurno') IdTurno: number) {
    return this.turnosService.cancelarTurno(IdTurno);
  }

  //6 - informacion de mascota, turnos,historial
  @UseGuards() 
  @Get('mascotas/historial/:IdMascota')
  obtenerMascotasTurnosHistorial(@Param('IdMascota') IdMascota: number) {
    return this.turnosService.obtenerTurnosHistorial(IdMascota);
  }

  //7 - Ver mis citas psicologo
  //@UseGuards(AuthGuard('psicologo'))
  @UseGuards(AuthGuard('AdminPsico'))
  @Get('/turnos/psicologos')
  consultarTurnos(@Body() turno: consultarTurnosDto) {
    return this.turnosService.consultarTurnos(turno);
  }

  //8 - terminar cita cargar historial
  @UseGuards(AuthGuard('AdminPsico'))
  @Post('/terminar')
  terminarCita(@Body() turno: terminarCitaDto) {
    return this.turnosService.terminarCita(turno);
  }

 
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { turno } from './turno.entity';
import { DataSource, EntityManager, getRepository } from 'typeorm';
import { consultarTurnosDto } from './DTO/consultar-turnos.dto';
import { registrarTurnoDto } from './DTO/registrar-turno.dto';
import { pet } from 'src/pets/pet.entity';
import { terminarCitaDto } from './DTO/terminar-cita.dto';


@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(turno) private turnoRepository: Repository<turno>, private readonly entityManager: EntityManager
  ) {}

  async findAll(): Promise<turno[]> {
    return await this.turnoRepository.find();
  }

  async findTurnosByMascota() {
   return await this.turnoRepository.find();
  }

  //1- En usuarios service. (Ver psicologos)
  //2- Ver turnos disponibles 

  //3- Registrar un turno
  async register(nuevoTurno : registrarTurnoDto){

    //primero obtengo el tipo para ver el tiempo de la consulta
    const obtengoTipo = await this.entityManager.query(`select Tipo from Mascotas where IdMascota = 4`)
    const Tipo = obtengoTipo[0].Tipo;
    const Fecha_inicio = new Date(nuevoTurno.Fecha_inicio);
    if(Tipo === 'perro'){
      console.log("el tiempo de la consulta es 30m")
      //Seteo la fecha fin segun el tipo de animal
      const nuevaFechaFin = new Date(Fecha_inicio.getTime() + 30 * 60000);
      nuevoTurno.Fecha_fin = nuevaFechaFin;
    }
    else if(Tipo === 'gato'){
      console.log("el tiempo de la consulta es 45m")
      //Seteo la fecha fin segun el tipo de animal
      const nuevaFechaFin = new Date(Fecha_inicio.getTime() + 45 * 60000);
      nuevoTurno.Fecha_fin = nuevaFechaFin;
    }

    

    //verifico que la mascota no tenga un turno dado
    const verificoTurno = await this.entityManager.query(`select count(*) turno from Turnos where IdMascota = ${nuevoTurno.IdMascota} and IdEstado = 1`)
    const turno = verificoTurno[0].turno;
    console.log(turno + "cantidad de turnos");
    console.log(turno);
    if(turno == 0){
      //Si la mascota no tiene un turno dado verifico si hay lugar entre la fecha de inicio y fin
      console.log("verificando disponibilidad")

      const verificacion = await this.entityManager.query(`SELECT COUNT(*) verificacion
                                                          FROM Turnos t
                                                          WHERE Fecha_inicio < '${nuevoTurno.Fecha_fin.toISOString()}' AND Fecha_fin >  '${Fecha_inicio.toISOString()}'`);
      const verificacionLugar = verificacion[0].verificacion;
      
      if(verificacionLugar == 0){
        console.log("hay lugar en las fechas seleccionadas");
        console.log(Fecha_inicio.toISOString());
        console.log(nuevoTurno.IdMascota,Fecha_inicio.toISOString(),nuevoTurno.Fecha_fin.toISOString(), nuevoTurno.IdPsicologo);
        const registroTurno = await this.entityManager.query(`insert into Turnos (IdMascota, Fecha_inicio, Fecha_fin, IdEstado, IdPsicologo) values (${nuevoTurno.IdMascota}, '${Fecha_inicio.toISOString()}', '${nuevoTurno.Fecha_fin.toISOString()}', 1, ${nuevoTurno.IdPsicologo})`)
        return("registrando turno");

      } else{

        return(" no hay lugar en la fecha y horario solicitado");
      }

      
    } else {
      return ("ERROR: tiene turnos activos");
    }

    
       

}

  //4- ver mis turnos
  async verTurnos(IdUsuario: number): Promise<any> {
    const result = await this.entityManager.query(`SELECT IdTurno, Fecha_inicio, Fecha_fin, IdEstado, Nombre, IdCliente 
    FROM Turnos t 
    JOIN Mascotas m ON t.IdMascota = m.IdMascota 
    JOIN Usuarios u ON m.IdCliente = u.IdUsuario 
    WHERE IdEstado = 1 AND IdCliente = ${IdUsuario}`);
    return result;
  }

  //5- cencelar un turno
  async cancelarTurno(IdTurno: number): Promise<any> {
    const result = await this.entityManager.query(`UPDATE Turnos
    SET IdEstado = 3
    WHERE IdTurno = ${IdTurno};`);
    return result;
  }

  //6-ver informacion de la mascota, con turnos e historial
  async infoMascotaTurno(IdMascota:number): Promise<any> {
    const result = await this.entityManager.query(`select m.IdMascota, m.IdCliente, m.Nombre, m.Tipo, t.IdTurno, t.Fecha_inicio, t.Fecha_fin, h.descripcion
    from Mascotas m join Turnos t on m.IdMascota = t.IdMascota join Historial h on t.IdMascota = h.IdMascota
    where m.IdMascota = ${IdMascota}`)

    return result;
  }

  //7- Ver mis citas (Admin y psicologo)

   async consultarTurnos(turno: consultarTurnosDto){
    const result = await this.entityManager.query(`select * from turnos where IdPsicologo = ${turno.IdPsicologo} and CAST(Fecha_inicio AS date) = CONVERT(date, '${turno.fecha}', 23)`);

    console.log(turno.IdPsicologo, turno.fecha);
    return result;
  }


  //8- terminar cita y cargar el historial clinico (Admin y psicologo)

    async terminarCita(turno:terminarCitaDto){
    const result = await this.entityManager.query(`begin transaction
    update Turnos set IdEstado = 3 where IdTurno = ${turno.IdTurno}
    insert into Historial (IdMascota, fecha, descripcion) values (${turno.IdMascota}, GETDATE(), '${turno.descripcion}')
    commit transaction`)
    
    console.log(turno.IdTurno, turno.IdMascota, turno.descripcion)
    return result;
  }



}

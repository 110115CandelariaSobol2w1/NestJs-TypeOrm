import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { turno } from './turno.entity';
import {
  EntityManager,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
} from 'typeorm';
import { consultarTurnosDto } from './DTO/consultar-turnos.dto';
import { registrarTurnoDto } from './DTO/registrar-turno.dto';
import { pet } from 'src/pets/pet.entity';
import { terminarCitaDto } from './DTO/terminar-cita.dto';
import { turnosDisponiblesDto } from './DTO/turnos-disponibles.dto';
import { historial } from '../historial/historial.entity';
import { user } from 'src/users/user.entity';
import { Console } from 'console';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(turno) private turnoRepository: Repository<turno>,
    @InjectRepository(pet) private petRepository: Repository<pet>,
    @InjectRepository(historial)
    private historialRepository: Repository<historial>,
    @InjectRepository(user) private userRepository: Repository<user>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(): Promise<turno[]> {
    return await this.turnoRepository.find();
  }

  async findTurnosByMascota() {
    return await this.turnoRepository.find();
  }

  //1- Obtener psicologos LISTO
  async obtenerPsicologos(): Promise<user[]> {
    return this.userRepository.find({
      select: {
        username: true,
        IdUsuario: true,
      },
      where: {
        IdRol: 3,
      },
    });
  }

  //2- Ver turnos disponibles LISTO.
  async getHorariosDisponibles(turnosDisponibles: turnosDisponiblesDto,): Promise<Date[]> {
    //primero obtengo el tipo para ver el tiempo de la consulta
    const obtengoTipo = await await this.petRepository.find({
      select: {
        Tipo: true,
      },
      where: {
        IdMascota: turnosDisponibles.IdMascota,
      },
    });
    const tipo = obtengoTipo[0].Tipo;
    const duracion = tipo === 'gato' ? 45 : 30; // duración según el tipo de mascota
    const fechaString = turnosDisponibles.fecha;
    const fechaSplit = fechaString.split('/');
    var fechaDate = new Date(`${fechaSplit[2]}/${fechaSplit[1]}/${fechaSplit[0]}`);

    const fechaInicio = new Date(fechaDate); // convertir la fecha a un objeto Date
    fechaInicio.setHours(9, 0, 0, 0); // establecer la hora de inicio de la agenda
    const fechaFin = new Date(fechaDate);
    fechaFin.setHours(18, 0, 0, 0); // establecer la hora de fin de la agenda

    //obtengo los turnos programados para esa fecha
    const turnos = await this.turnoRepository.find({
      where: {
        Fecha_inicio: fechaInicio,
        IdPsicologo: turnosDisponibles.IdPsicologo,
      },
    });

    const horariosDisponibles = []; //creo array para guardar los turnos disponibles
    let hora = fechaInicio;
    while (hora <= fechaFin) {
      // verificar si la hora está disponible
      const horaFin = new Date(hora.getTime() + duracion * 60000);
      const disponible = await this.turnoRepository.count({
        where: [
          {
            Fecha_inicio: LessThanOrEqual(horaFin),
            Fecha_fin: MoreThanOrEqual(hora),
          },
          {
            Fecha_inicio: LessThan(hora),
            Fecha_fin: MoreThan(horaFin),
          },
        ],
      });

      // var reservas = await this.turnoRepository.createQueryBuilder('turnos')
      // .select('COUNT(*)', 'cantidad_reservas_superpuestas')
      // .where(
      //   '((Fecha_inicio <= :fecha_inicio AND Fecha_fin > :fecha_inicio) OR ' +
      //     '(Fecha_inicio < :fecha_fin AND Fecha_fin >= :fecha_fin) OR ' +
      //     '(Fecha_inicio >= :fecha_inicio AND Fecha_fin <= :fecha_fin))',
      //   { fecha_inicio: hora, fecha_fin: horaFin },
      // )
      // .getRawMany();

      // return reservas.cantidad_reservas_superpuestas
    

      console.log('DISPONIBILIDAD ' + ' ' + disponible);

      if (disponible == 0) {
        horariosDisponibles.push(new Date(hora));
      }
      // avanzar a la siguiente hora
      hora = new Date(hora.getTime() + 15 * 60000); // avanzar en bloques de 15 minutos
    }
    return horariosDisponibles;
  }

  //3 - Registrar un turno LISTO
  async nuevoTurno(nuevoTurno: registrarTurnoDto) {
    //primero obtengo el tipo para ver el tiempo de la consulta
    const obtengoTipo = await await this.petRepository.find({
      select: {
        Tipo: true,
      },
      where: {
        IdMascota: nuevoTurno.IdMascota,
      },
    });
    const Tipo = obtengoTipo[0].Tipo;

    //verifico que la mascota no tenga un turno dado
    const verificoTurno = await await this.turnoRepository.count({
      where: {
        IdMascota: nuevoTurno.IdMascota,
        IdEstado: 1,
      },
    });
    const turno = verificoTurno;

    if (Tipo === 'perro' && turno == 0) {
      const Fecha_inicio = new Date(nuevoTurno.Fecha_inicio);
      const nuevaFechaFin = new Date(Fecha_inicio.getTime() + 30 * 60000);
      nuevoTurno.Fecha_fin = nuevaFechaFin;

      //Si la mascota no tiene un turno dado verifico si hay lugar entre la fecha de inicio y fin
      console.log('verificando disponibilidad');
      //check_in <= @Check_out AND check_out > @Check_in
      const verificacion = await this.turnoRepository.count({
        where: {
          Fecha_inicio: LessThanOrEqual(nuevoTurno.Fecha_fin),
          Fecha_fin: MoreThan(nuevoTurno.Fecha_inicio),
        },
      });

      const verificacionLugar = verificacion;
      const IdEstado = 1;
      //si hay lugar en las fechas registro el turno
      if (verificacionLugar == 0) {
        console.log('hay lugar en las fechas seleccionadas');
        const registrandoTurno = this.turnoRepository.create({
          IdMascota: nuevoTurno.IdMascota,
          Fecha_inicio: nuevoTurno.Fecha_inicio,
          Fecha_fin: nuevaFechaFin, //no me toma la nueva fecha de fin.
          IdEstado: IdEstado,
          IdPsicologo: nuevoTurno.IdPsicologo,
        });

        await this.turnoRepository.save(registrandoTurno);

        return 'registrando turno';
      } else {
        return 'No hay lugar en las fechas solicitadas';
      }
    } else if (Tipo === 'gato' && turno == 0) {
      const Fecha_inicio = new Date(nuevoTurno.Fecha_inicio);
      const nuevaFechaFin = new Date(Fecha_inicio.getTime() + 45 * 60000);
      nuevoTurno.Fecha_fin = nuevaFechaFin;

      //Si la mascota no tiene un turno dado verifico si hay lugar entre la fecha de inicio y fin
      console.log('verificando disponibilidad');

      const verificacion = await this.turnoRepository.count({
        where: {
          Fecha_inicio: LessThanOrEqual(nuevoTurno.Fecha_fin),
          Fecha_fin: MoreThanOrEqual(nuevoTurno.Fecha_inicio),
        },
      });

      const verificacionLugar = verificacion;
      const IdEstado = 1;
      //si hay lugar en las fechas registro el turno
      if (verificacionLugar == 0) {
        console.log('hay lugar en las fechas seleccionadas');
        const registrandoTurno = this.turnoRepository.create({
          IdMascota: nuevoTurno.IdMascota,
          Fecha_inicio: nuevoTurno.Fecha_inicio,
          Fecha_fin: nuevaFechaFin, //no me toma la nueva fecha de fin.
          IdEstado: IdEstado,
          IdPsicologo: nuevoTurno.IdPsicologo,
        });

        await this.turnoRepository.save(registrandoTurno);

        return 'registrando turno';
      } else {
        return 'No hay lugar en las fechas solicitadas';
      }
    } else if (turno == 1) {
      return 'La mascota ya tiene un turno activo registrado';
    }
  }

  //4- ver mis turnos LISTO
  async obtenerTurnosMascotas(IdCliente: number): Promise<pet[]> {
    return this.petRepository.find({
      where: {
        IdCliente: IdCliente,
        turnos: {
          IdEstado: 1,
        },
      },

      relations: {
        turnos: true,
      },
    });
  }

  //5- cencelar un turno LISTO
  async cancelarTurno(IdTurno: number): Promise<any> {
    const result = await this.turnoRepository.update(
      { IdTurno: IdTurno },
      { IdEstado: 3 },
    );
    // const result = await this.entityManager.query(`UPDATE Turnos
    // SET IdEstado = 3
    // WHERE IdTurno = ${IdTurno};`);
    return 'Turno cancelado con exito';
  }

  //6-ver informacion de la mascota, con turnos e historial. LISTO
  async obtenerTurnosHistorial(IdMascota: number): Promise<pet[]> {
    return this.petRepository.find({
      where: {
        IdMascota: IdMascota,
      },
      relations: {
        turnos: {
          historial: true,
        },
      },
    });
  }

  //7- Ver mis citas (Admin y psicologo) LISTO

  async consultarTurnos(turno: consultarTurnosDto) {
    // const result = await this.entityManager.query(
    //   `select * from turnos where IdPsicologo = ${turno.IdPsicologo} and CAST(Fecha_inicio AS date) = CONVERT(date, '${turno.fecha}', 23)`,
    // );
    const IdPsicologo = turno.IdPsicologo;
    const fecha = turno.fecha;
    const queryBuilder = this.turnoRepository
      .createQueryBuilder()
      .where('IdPsicologo = :IdPsicologo', { IdPsicologo })
      .andWhere(`CAST(Fecha_inicio AS date) = CAST(:fecha AS date)`, { fecha });

    const turnos = await queryBuilder.getMany();
    return turnos;
  }

  //8- terminar cita y cargar el historial clinico (Admin y psicologo) LISTO

  async terminarCita(turno: terminarCitaDto) {
    // const result = await this.entityManager.query(`begin transaction
    // update Turnos set IdEstado = 3 where IdTurno = ${turno.IdTurno}
    // insert into Historial (IdMascota, fecha, descripcion) values (${turno.IdMascota}, GETDATE(), '${turno.descripcion}')
    // commit transaction`);

    // console.log(turno.IdTurno, turno.IdMascota, turno.descripcion);

    //return result;

    const IdEstado = 3;
    const IdTurno = turno.IdTurno;

    const queryBuilder = this.turnoRepository
      .createQueryBuilder()
      .update(turno)
      .set({ IdEstado: IdEstado })
      .where('IdTurno = :IdTurno', { IdTurno })
      .execute();

    //const IdTurno = turno.IdTurno
    const fecha = new Date();
    const descripcion = turno.descripcion;

    const queryhistorial = this.historialRepository
      .createQueryBuilder()
      .insert()
      .into(historial)
      .values({
        IdTurno: IdTurno,
        fecha: fecha,
        Descripcion: descripcion,
      })
      .execute();

    return 'Turno finalizado. Historial cargado con exito';
  }
}

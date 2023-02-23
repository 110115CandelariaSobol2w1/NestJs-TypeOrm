import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { turno } from './turno.entity';
import { EntityManager, getRepository } from 'typeorm';


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

  async verTurnos(IdUsuario: number): Promise<any> {
    const result = await this.entityManager.query(`SELECT IdTurno, Fecha_inicio, Fecha_fin, IdEstado, Nombre, IdCliente 
    FROM Turnos t 
    JOIN Mascotas m ON t.IdMascota = m.IdMascota 
    JOIN Usuarios u ON m.IdCliente = u.IdUsuario 
    WHERE IdEstado = 1 AND IdCliente = ${IdUsuario}`);
    return result;
  }

  async cancelarTurno(IdTurno: number): Promise<any> {
    const result = await this.entityManager.query(`UPDATE Turnos
    SET IdEstado = 3
    WHERE IdTurno = ${IdTurno};`);
    return result;
  }

  async infoMascotaTurno(IdMascota:number): Promise<any> {
    const result = await this.entityManager.query(`select m.IdMascota, m.IdCliente, m.Nombre, m.Tipo, t.IdTurno, t.Fecha_inicio, t.Fecha_fin, h.descripcion
    from Mascotas m join Turnos t on m.IdMascota = t.IdMascota join Historial h on t.IdMascota = h.IdMascota
    where m.IdMascota = ${IdMascota}`)

    return result;
  }

  


}

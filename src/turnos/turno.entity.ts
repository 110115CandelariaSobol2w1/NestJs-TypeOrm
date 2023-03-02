import { historial } from 'src/historial/historial.entity';
import { pet } from 'src/pets/pet.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Turnos' })
export class turno {
  @PrimaryGeneratedColumn()
  IdTurno: number;

  @Column()
  IdMascota: number;

  @Column()
  Fecha_inicio: Date;

  @Column()
  Fecha_fin: Date;

  @Column()
  IdEstado: number;

  @Column()
  IdPsicologo: number;

  @OneToOne(() => historial)
  @JoinColumn({ name: 'IdTurno' })
  historial: historial;

  @ManyToOne(() => pet, (pet) => pet.turnos)
  @JoinColumn({ name: 'IdMascota' })
  mascota: pet;
}

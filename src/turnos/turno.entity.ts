import { pet } from "src/pets/pet.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'Turnos'})
export class turno{

    @PrimaryGeneratedColumn()
    IdTurno:number

    @Column()
    IdMascota:number

    @Column()
    Fecha_inicio:Date

    @Column()
    Fecha_fin:Date

    @Column()
    IdEstado:number

    @Column()
    IdPsicologo:number

    

}
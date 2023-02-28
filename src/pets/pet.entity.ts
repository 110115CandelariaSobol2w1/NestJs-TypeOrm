import { turno } from "src/turnos/turno.entity";
import { user } from "src/users/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'Mascotas'})
export class pet{

    @PrimaryGeneratedColumn()
    IdMascota:number

    @Column()
    nombre:string

    @Column()
    IdCliente:number

    @Column()
    Tipo:string

    @OneToOne(() => turno)
    @JoinColumn({name: 'IdMascota'})
    turno: turno;

    @OneToOne(() => user)
    @JoinColumn({name: 'IdCliente'})
    user:user

}
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

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
}
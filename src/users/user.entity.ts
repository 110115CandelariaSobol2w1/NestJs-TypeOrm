import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'Usuarios'})
export class user{

    @PrimaryGeneratedColumn()
    IdUsuario:number

    @Column()
    username:string

    @Column()
    password:string

    @Column()
    IdRol:number
}
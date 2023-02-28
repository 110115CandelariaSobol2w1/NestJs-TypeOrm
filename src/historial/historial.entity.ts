import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({name: 'Historial'})
export class historial{

    @PrimaryGeneratedColumn()
    IdHistoria:number

    @Column()
    IdMascota:number

    @Column()
    fecha:Date

    @Column()
    Descripcion:string
}
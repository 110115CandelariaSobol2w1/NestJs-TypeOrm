import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PetsModule } from './pets/pets.module';
import { pet } from './pets/pet.entity';
import { user } from './users/user.entity';
import { TurnosModule } from './turnos/turnos.module';
import { turno } from './turnos/turno.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'sa',
    password: '12345678',
    database: 'Mascotas',
    entities: [
    pet,user, turno
   ],
    extra:{trustServerCertificate:true}
  }), UsersModule, PetsModule, TurnosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

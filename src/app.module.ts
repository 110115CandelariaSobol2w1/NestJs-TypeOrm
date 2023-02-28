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
import { HistorialModule } from './historial/historial.module';
import { historial } from './historial/historial.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'sa',
    password: '12345678',
    database: 'Mascotas',
    entities: [
    pet,user, turno, historial
   ],
    extra:{trustServerCertificate:true}
  }), UsersModule, PetsModule, TurnosModule, HistorialModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pet } from 'src/pets/pet.entity';
import { historial } from '../historial/historial.entity';
import { turno } from './turno.entity';
import { TurnosController } from './turnos.controller';
import { TurnosService } from './turnos.service';

@Module({
  imports: [TypeOrmModule.forFeature([turno, pet, historial]),
],
  controllers: [TurnosController],
  providers: [TurnosService]
})
export class TurnosModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { turno } from './turno.entity';
import { TurnosController } from './turnos.controller';
import { TurnosService } from './turnos.service';

@Module({
  imports: [TypeOrmModule.forFeature([turno]),
],
  controllers: [TurnosController],
  providers: [TurnosService]
})
export class TurnosModule {}

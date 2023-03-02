import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pet } from 'src/pets/pet.entity';
import { psicologoClienteStrategy } from 'src/users/JWT/admin-cli.strategy';
import { psicologoAdminStrategy } from 'src/users/JWT/admin-psico.strategy';
import { jwtConstanst } from 'src/users/JWT/jwt.constants';
import { JwtStrategy } from 'src/users/JWT/jwt.strategy';
import { psicologoStrategy } from 'src/users/JWT/psicologo.strategy';
import { user } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { historial } from '../historial/historial.entity';
import { turno } from './turno.entity';
import { TurnosController } from './turnos.controller';
import { TurnosService } from './turnos.service';

@Module({
  imports: [TypeOrmModule.forFeature([turno, pet, historial,user]), UsersModule, JwtModule
  ],
  controllers: [TurnosController],
  providers: [TurnosService, psicologoStrategy, psicologoAdminStrategy, psicologoClienteStrategy]
})
export class TurnosModule {}

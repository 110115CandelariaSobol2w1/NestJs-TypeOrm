import {
  Body,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstanst } from './jwt.constants';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { pet } from 'src/pets/pet.entity';
import { Repository } from 'typeorm';
import { TurnosService } from 'src/turnos/turnos.service';
import { UsersService } from '../users.service';
import { PetsService } from 'src/pets/pets.service';

@Injectable()
export class psicologoClienteStrategy extends PassportStrategy(
  Strategy,
  'PsicoCliente',
) {
  constructor(
    private turnosService: TurnosService,
    private userService: UsersService,
    private petService: PetsService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstanst.secret,
      passReqToCallback: true,
    });
  }

  async validate(req:Request,payload: any) {
    console.log('IdRol muestro rol' + payload.IdRol);
    //const idUsuarioRequest = payload.idUsuario;
    console.log(payload.IdUsuario);
    const { IdMascota } = req.body;
    const query = await this.petService.getPetById(IdMascota)
    console.log(query.IdCliente);
    //console.log("devuelvo id " + usuario + "comparo id " + payload.IdUsuario)

    if (payload.IdRol === 1 || payload.IdRol === 2 && query.IdCliente === payload.IdUsuario) {
      
      return { IdUsuario: payload.IdUsuario };
    }

    throw new HttpException('No es tu mascota, no tenes permiso', 401);
  }
}

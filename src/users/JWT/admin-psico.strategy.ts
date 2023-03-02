import { HttpException, Injectable, UnauthorizedException} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstanst } from "./jwt.constants";
import { Request } from "express";

@Injectable()
export class psicologoAdminStrategy extends PassportStrategy(Strategy, 'AdminPsico'){
    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false, 
            secretOrKey:jwtConstanst.secret,
        });
    }

    async validate(payload:any){
        console.log("IdRol muestro rol" + payload.IdRol)
        if(payload.IdRol === 1 || payload.IdRol === 3){

            return { IdUsuario: payload.IdUsuario} 
        }

        else{
            throw new HttpException('nooo', 401)
        }
    }

}
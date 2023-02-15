
import { HttpException, Injectable, UnauthorizedException} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstanst } from "./jwt.constants";
import { Request } from "express";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false, 
            secretOrKey:jwtConstanst.secret,
            passReqToCallback: true,
        });
    }

    //validacion para IdRol = 1 = Admin
    // async validate(payload: any){
 
    //     if (!(payload.IdRol == '1')){
    //         throw new HttpException('UNAUTHORIZED USER', 401)
    //     }
      
    //     return { id: payload.IdCliente, name: payload.username, IdRol: payload.IdRol};
    // }

    async validate(req:Request, payload:any){
        const IdUsuario = +req.params.IdCliente;
        console.log(IdUsuario + "id usuario")  
        console.log(payload.id + "id Cliente")

        if(payload.IdRol ===1){

            return { IdUsuario: payload.IdUsuario} 
        }
        
        if(IdUsuario !== payload.id)
        {
            throw new HttpException('UNAUTHORIZED USER', 401)
        }

        return { IdUsuario: payload.IdUsuario}
     }
      
    
}









import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstanst } from "./jwt.constants";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false, 
            secretOrKey:jwtConstanst.secret,
        });
    }

    //validacion para IdRol = 1 = Admin
    async validate(payload: any){

        if (!(payload.IdRol == '1')){
            throw new HttpException('UNAUTHORIZED USER', 401)
        }
    
        return { id: payload.IdCliente, name: payload.username, IdRol: payload.IdRol};
      }
        
    
}

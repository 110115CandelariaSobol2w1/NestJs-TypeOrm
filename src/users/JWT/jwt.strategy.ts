
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
            passReqToCallBack:true
        });
    }

 
        async validate(payload: any, req: Request) {

            console.log(payload);

        if (!payload) {
          throw new UnauthorizedException();
        }
      
        const clienteId = +req.params.IdUsuario;
      
        const user = await this.userService.findById(payload.IdCliente);
        if (!user) {
          throw new HttpException('El usuario no existe', 401);
        }
      
        if (clienteId !== payload.IdUsuario) {
          throw new HttpException('UNAUTHORIZED USER, No son tus mascotas', 401);
        }
      
        return { id: payload.IdUsuario, name: payload.username, IdRol: payload.IdRol };
      }


          //validacion para IdRol = 1 = Admin
    // async validate(payload: any){

    //     if (!(payload.IdRol == '1')){
    //         throw new HttpException('UNAUTHORIZED USER', 401)
    //     }

    //     return { id: payload.IdCliente, name: payload.username, IdRol: payload.IdRol};
    //   }

        
    
}








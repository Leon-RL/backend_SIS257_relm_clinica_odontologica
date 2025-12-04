import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Odontologo } from "src/odontologos/entities/odontologo.entity";
import { Paciente } from "src/pacientes/entities/paciente.entity";
import { AuthService } from "../auth.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_TOKEN ?? '',
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload): Promise<Paciente | Odontologo> {
    return await this.authService.verifyPayload(payload);
  }
}
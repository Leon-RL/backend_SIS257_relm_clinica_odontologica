export interface JwtPayload {
  sub: number;
  rol: 'odontologo' | 'paciente';
  iat?: number;
  exp?: number;
}

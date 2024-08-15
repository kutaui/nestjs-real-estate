import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';

function cookieExtractor(req: RequestType) {
  if (req.headers.cookie) {
    return req.headers.cookie.split("=")[1]
  }
  return null;
}


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromHeader('token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: '123',
    });
  }

  validate(payload: any) {
    console.log('Inside JWT Strategy Validate');
    console.log(payload);
    return payload;
  }
}

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({ usernameField: 'email' });
  }

  validate(email: string, password: string) {
    console.log('Inside LocalStrategy');
    const user = this.userService.validateUser({ email, password });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
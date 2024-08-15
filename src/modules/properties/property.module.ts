import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property, PropertyType } from './entities/property.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { JwtStrategy } from '../users/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, User, PropertyType]),
    JwtModule.register({
      secret: '123',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [PropertyController],
  providers: [PropertyService, UserService, JwtStrategy],
})
export class PropertyModule {}

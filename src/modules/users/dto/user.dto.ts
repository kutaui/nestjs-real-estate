import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';

export class LoginPayloadDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty()
  email: string;

  @IsString()
  @Length(6, 20, { message: 'Password must be between 8 and 20 characters' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  @ApiProperty()
  password: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @ApiProperty()
  phone: string;

  @IsEnum(UserRole, { message: 'Invalid role' })
  @IsOptional()
  @ApiProperty()
  role: UserRole = UserRole.AGENCY;
}

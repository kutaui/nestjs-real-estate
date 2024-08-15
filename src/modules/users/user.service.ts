import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginPayloadDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(loginPayloadDto: LoginPayloadDto): Promise<string> {
    const { email, password } = loginPayloadDto;

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.jwtService.sign({ userId: user.id, userRole: user.role });
  }

  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { phone, email, password, role } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException('User with this email already exists', 409);
    }

    const userRole = role !== undefined ? role : UserRole.AGENCY; 

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      phone,
      password: hashedPassword,
      role: userRole,
    });

    await this.usersRepository.save(user);

    const { password: _, ...passwordlessUser } = user;
    return passwordlessUser;
  }
}

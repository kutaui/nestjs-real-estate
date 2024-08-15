import {
  Body,
  Controller,
  HttpException,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CreateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalGuard } from './guards/local.guard';
import { UserService } from './user.service';

@ApiTags('user')
@ApiCookieAuth('token')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Login with email & password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'Password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON web token and sets it as a cookie.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        token: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request, @Res() res: Response) {
    const jwt = req.user;

    res.cookie('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({ success: true, token: jwt });
  }

  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'Password123' },
        phone: { type: 'string', example: '+905064859384' },
        role: {
          type: 'string',
          enum: Object.values(UserRole),
          example: UserRole.AGENCY,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User Created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        phone: { type: 'string' },
        role: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Only admins can create users',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  @Post('createUser')
  @UseGuards(JwtAuthGuard)
  async createUser(
    @Req()
    req: Request & { user: { userId: number; userRole: 'admin' | 'agency' } },
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ) {
    if (req.user.userRole !== 'admin')
      throw new HttpException('Only admins can add an user', 401);

    const newUser = await this.userService.createUser(createUserDto);

    return newUser;
  }
}

import {
  Body,
  Controller,
  HttpException,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../users/guards/jwt.guard';
import { CreatePropertyDto } from './dto/property.dto';
import { Property, PropertyType } from './entities/property.entity';
import { PropertyService } from './property.service';
import { PropertyTypeEnum } from 'src/common/enums/property-type.enum';

@ApiCookieAuth('token')
@ApiTags('property')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @ApiOperation({ summary: 'Create a new property' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Dublex Villa' },
        location: { type: 'string', example: 'France/Paris Ile-de-France' },
        propertyType: {
          type: 'string',
          enum: Object.values(PropertyTypeEnum),
          example: PropertyTypeEnum.VILLA,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The property has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        location: { type: 'string' },
        propertyType: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - Only authenticated agencies can create properties',
  })
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createProperty(
    @Req()
    req: Request & { user: { userId: number; userRole: 'agency' | 'admin' } },
    @Body(new ValidationPipe()) createPropertyDto: CreatePropertyDto,
  ): Promise<Property> {
    if (req.user.userRole !== 'agency')
      throw new HttpException('Only agencies can add a property', 401);

    return this.propertyService.createProperty(
      createPropertyDto,
      req.user.userId,
    );
  }
}

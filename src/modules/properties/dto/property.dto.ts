import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PropertyTypeEnum } from 'src/common/enums/property-type.enum';

export class CreatePropertyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Property name is required' })
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @ApiProperty()
  @IsEnum(PropertyTypeEnum, { message: 'Invalid type' })
  propertyType: PropertyTypeEnum;

  @ApiProperty()
  userId: number;
}

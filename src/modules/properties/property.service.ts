import { Injectable } from '@nestjs/common';
import { Property, PropertyType } from './entities/property.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePropertyDto } from './dto/property.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(PropertyType) // Add if PropertyType is needed
    private propertyTypeRepository: Repository<PropertyType>,
  ) {}

  async createProperty(
    createPropertyDto: CreatePropertyDto,
    userId: number,
  ): Promise<Property> {
 

    const user = await this.usersRepository.findOneBy({ id: userId });

    const propertyType = await this.propertyTypeRepository.findOneBy({ name: createPropertyDto.propertyType });

    const newProperty = this.propertyRepository.create({
      ...createPropertyDto,
      user,
      propertyType,
    });

    return this.propertyRepository.save(newProperty);
  }
}

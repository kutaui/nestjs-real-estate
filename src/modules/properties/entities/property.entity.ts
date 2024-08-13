import { PropertyTypeEnum } from 'src/common/enums/property-type.enum';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class PropertyType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PropertyTypeEnum,
  })
  name: PropertyTypeEnum;
}

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @ManyToOne(() => PropertyType)
  @JoinColumn({ name: 'propertyTypeId' })
  propertyType: PropertyType;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}

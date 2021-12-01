import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';

import { RoleEntity } from './role.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  surname: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  password?: string;
  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  birthDay?: Date;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate?: number;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastmodifiedDate?: number;

  @ManyToMany(() => RoleEntity, {
    cascade: true,
    eager: true,
  })
  @JoinTable({ name: 'role_user' })
  roles?: RoleEntity[];
}

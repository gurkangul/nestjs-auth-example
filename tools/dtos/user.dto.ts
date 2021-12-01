import { RoleEntity } from 'tools/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @IsNotEmpty()
  @ApiProperty()
  surname?: string;
  @IsNotEmpty()
  @ApiProperty()
  password?: string;
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsNotEmpty()
  @ApiProperty()
  birthDay?: Date;
  roles?: RoleEntity[];
}

// tslint:disable-next-line:max-classes-per-file
export class UserUpdateDto {
  name: string;
  @ApiProperty()
  surname: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  birthDay: Date;

  @ApiProperty()
  roles: any[];
}

// tslint:disable-next-line:max-classes-per-file
export class UserLoginDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

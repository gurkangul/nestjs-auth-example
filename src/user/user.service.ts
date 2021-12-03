import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'tools/entities/user.entity';
import {
  UserCreateDto,
  UserLoginDto,
  UserRoleDto,
  UserUpdateDto,
} from 'tools/dtos/user.dto';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { RoleEntity } from 'tools/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private authService: AuthService,
  ) {}

  async create(createdUserDto: UserCreateDto): Promise<UserEntity> {
    let user = await this.userRepository.findOne({
      email: createdUserDto.email,
    });

    if (!user) {
      let passwordHash = await this.authService.hashPassword(
        createdUserDto.password,
      );

      let findRole = await this.roleRepository.findOne({ name: 'user' });
      if (findRole) {
        createdUserDto.roles = [findRole];
      }
      // this.userRepository.manager.save(findRole);
      // Overwrite the user password with the hash, to store it in the db
      createdUserDto.password = passwordHash;
      createdUserDto.email = createdUserDto.email.toLowerCase();
      let savedUser = await this.userRepository.save(createdUserDto);
      const { password, ...user } = savedUser;
      return user;
    } else {
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    }
  }

  async update(
    updateUserDto: UserUpdateDto,
    user: UserEntity,
  ): Promise<UserEntity> {
    if (user) {
      await this.userRepository.update(user.id, { ...updateUserDto });
      return this.userRepository.findOne(user.id);
    } else {
      throw new HttpException('Something wrong', HttpStatus.CONFLICT);
    }
  }

  async updateRole(updateRole: UserRoleDto): Promise<UserEntity> {
    let user = await this.findOneByEmail(updateRole.userEmail);
    if (updateRole?.roles?.length) {
      let roles = [];
      for await (let roleData of updateRole?.roles) {
        console.log('aaaa', roleData);

        let findRole = await this.roleRepository.findOne({ name: roleData });
        if (findRole) {
          roles = [...roles, findRole];
        }
      }
      this.userRepository.manager.save(roles);

      updateRole.roles = roles;
    }
    if (user) {
      user = { ...user, ...updateRole };
      console.log(user);
      // await this.userRepository.merge(user, updateUserDto);
      return await this.userRepository.save(user);
    } else {
      throw new HttpException('Something wrong', HttpStatus.CONFLICT);
    }
  }

  async login(loginUserDto: UserLoginDto): Promise<string> {
    let findUserByEmail = await this.findUserByEmail(loginUserDto.email);
    if (findUserByEmail) {
      let passwordsMatches = await this.validatePassword(
        loginUserDto.password,
        findUserByEmail.password,
      );
      if (passwordsMatches) {
        let user = await this.findOne(findUserByEmail.id);
        let userJwt = {
          id: user.id,
          email: user.email,
          roles: user.roles,
          image: user.image,
        };
        return this.authService.generateJwt(userJwt);
      } else {
        throw new HttpException(
          'Login was not Successfulll',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const sss = await this.userRepository.find({ relations: ['roles'] });
    console.log(sss);
    return sss;
  }

  async findOne(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
    // return from(this.userRepository.find({ relations: ['roles'] })).pipe(
    //   map((savedUser: any) => {
    //     let roles: RoleEntity[] = savedUser['roles'];
    //     console.log(savedUser, roles);
    //     return savedUser;
    //   }),
    // );
  }
  async findOneByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ email });
    // return from(this.userRepository.find({ relations: ['roles'] })).pipe(
    //   map((savedUser: any) => {
    //     let roles: RoleEntity[] = savedUser['roles'];
    //     console.log(savedUser, roles);
    //     return savedUser;
    //   }),
    // );
  }

  private findUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne(
      { email },
      { select: ['id', 'email', 'name', 'password'] },
    );
  }
  private validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return this.authService.comparePasswords(password, storedPasswordHash);
  }
}

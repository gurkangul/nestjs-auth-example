import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  UserCreateDto,
  UserLoginDto,
  UserRoleDto,
  UserUpdateDto,
} from 'tools/dtos/user.dto';
import { UserEntity } from 'tools/entities/user.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'libs/guards/jwt-auth.guard';
import { AuthUser } from 'libs/decorators/user.decorator';
import { Roles } from 'libs/decorators/role.decorator';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() body: UserCreateDto): Promise<UserEntity> {
    return await this.userService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param() params): Promise<UserEntity> {
    return await this.userService.findOne(params.id);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: UserLoginDto): Promise<Object> {
    return await this.userService.login(loginUserDto).then((jwt: string) => {
      return {
        access_token: jwt,
        token_type: 'JWT',
        expires_in: 10000,
      };
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(200)
  async update(
    @AuthUser() user: UserEntity,
    @Body() UserUpdateDto: UserUpdateDto,
  ): Promise<Object> {
    return await this.userService.update(UserUpdateDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Put('role')
  @HttpCode(200)
  async updateRole(@Body() UserUpdateDto: UserRoleDto): Promise<Object> {
    return await this.userService.updateRole(UserUpdateDto);
  }

  // @Put(':id')
  // async updateUser(
  //   @Param('id') id: number,
  //   @Body() userUpdateDto: UserUpdateDto,
  // ): Promise<UserEntity> {
  //   return await this.userService.update(id, userUpdateDto);
  // }

  // @Delete(':id')
  // async removeUser(@Param('id') id: number): Promise<UserEntity> {
  //   console.log('removeUser');
  //   return await this.userService.delete(id);
  // }
}

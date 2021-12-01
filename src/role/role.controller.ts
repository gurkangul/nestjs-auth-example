import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleEntity } from 'tools/entities/role.entity';
import { RoleDto } from 'tools/dtos/role.dto';
import { Observable } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'libs/guards/jwt-auth.guard';
import { Roles } from 'libs/decorators/role.decorator';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles('admin')
  async CreateRole(@Body() body: RoleDto): Promise<RoleEntity> {
    return await this.roleService.create(body);
  }

  @Get()
  @Roles('admin')
  async getAllRoles(): Promise<RoleEntity[]> {
    return await this.roleService.findAll();
  }

  @Get(':id')
  async GetRole(@Param() params): Promise<RoleEntity> {
    return await this.roleService.findOne(params.id);
  }

  @Put(':id')
  @Roles('admin')
  async updateRole(
    @Param('id') id: number,
    @Body() roleDto: RoleDto,
  ): Promise<RoleEntity> {
    return await this.roleService.update(id, roleDto);
  }

  @Delete(':id')
  @Roles('admin')
  async removeRole(@Param('id') id: number): Promise<RoleEntity> {
    return await this.roleService.delete(id);
  }
}

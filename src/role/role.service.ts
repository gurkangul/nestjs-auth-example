import { Injectable } from '@nestjs/common';
import { RoleEntity } from 'tools/entities/role.entity';
import { RoleDto } from 'tools/dtos/role.dto';
import { ResourceService } from 'libs/services/resource.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService extends ResourceService<RoleEntity, RoleDto, RoleDto> {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,
  ) {
    super(roleRepo);
  }
}

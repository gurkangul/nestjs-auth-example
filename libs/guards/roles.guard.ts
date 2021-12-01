import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEntity } from 'tools/entities/role.entity';
import { UserEntity } from 'tools/entities/user.entity';
import environment from 'tools/environment/environment';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!allowedRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authJsonWebToken = request.headers.authorization;
    const result = jwt.verify(
      authJsonWebToken.slice(7, authJsonWebToken.length),
      environment.jwtText,
    );
    const user: UserEntity = result['user'];
    const allowed = await this.isAllowed(allowedRoles, user?.roles);
    if (!allowed) {
      throw new HttpException('Forbidden Method!', HttpStatus.FORBIDDEN);
    }
    return true;
  }

  async isAllowed(allowedRoles, userRoles: RoleEntity[]) {
    try {
      const allUsersRoles = [];
      await Promise.all(
        userRoles.map((data) => {
          allUsersRoles.push(data.name);
        }),
      );
      const hasRole = allUsersRoles.some((role) => allowedRoles.includes(role));
      return hasRole;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  }
}

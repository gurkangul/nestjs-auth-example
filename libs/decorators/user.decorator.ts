import { createParamDecorator } from '@nestjs/common';
import { UserEntity } from 'tools/entities/user.entity';
import environment from 'tools/environment/environment';
import * as jwt from 'jsonwebtoken';

export const AuthUser = createParamDecorator((data, req) => {
  const authJsonWebToken = req?.args?.[0]?.headers?.authorization;
  if (authJsonWebToken) {
    const result = jwt.verify(
      authJsonWebToken.slice(7, authJsonWebToken.length),
      environment.jwtText,
    );
    const user: UserEntity = result['user'];
    return user;
  } else {
    return null;
  }
});

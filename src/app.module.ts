import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LibsModule } from 'libs/libs.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import environment from 'tools/environment/environment';
import { RoleModule } from './role/role.module';
// import { TokenMiddleware } from 'libs/middlewares/token.middleware';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from 'libs/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    RoleModule,
    LibsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      // url: environment.dbUrl,
      database: process.env.POSTGRES_DB || environment.POSTGRES_DB,
      port: environment.POSTGRES_PORT,
      username: process.env.POSTGRES_USER || environment.POSTGRES_USER,
      host: process.env.POSTGRES_HOST || environment.POSTGRES_HOST,
      password: process.env.POSTGRES_PASSWORD || environment.POSTGRES_PASSWORD,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      retryDelay: 3000,
      retryAttempts: 10,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(TokenMiddleware)
//       .forRoutes({ path: '*', method: RequestMethod.ALL });
//   }
// }

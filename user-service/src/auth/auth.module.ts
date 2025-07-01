import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { RedisHelper } from 'src/redis/redis.helper';

@Global()
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          return UserSchema;
        },
      },
    ]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, RedisHelper],
})
export class AuthModule {}

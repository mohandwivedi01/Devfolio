import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MicroserviceModule } from './microservice/microservice.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profiles/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MicroserviceModule,
    AuthModule,
    ProfileModule,
  ],
})
export class AppModule {}

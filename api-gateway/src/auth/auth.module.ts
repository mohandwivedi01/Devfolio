import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "./auth.guard";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (ConfigService: ConfigService) => ({
                secret: ConfigService.get<string>('ACCESS_TOKEN_SECRET'),
                signOptions: {
                    expiresIn: ConfigService.get<string>('JWT_EXPIRATION_TIME') || '24h',
                },
            })
        })
    ],
    controllers: [AuthController],
    providers: [JwtAuthGuard],
})
export class AuthModule {}
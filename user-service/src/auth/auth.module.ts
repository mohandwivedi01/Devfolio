import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schema/auth.schema";

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
        ])
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";

@Module({
    imports: [],
    controllers: [ProfileController],
    providers: [],
})
export class ProfileModule {}
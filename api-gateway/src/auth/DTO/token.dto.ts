import { IsNotEmpty, IsString } from "class-validator";

export class GenerateAccessTokenDTO {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
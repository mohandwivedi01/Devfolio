import { IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";

export class UpdateUserDTO {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    name?: string;

    @IsString()
    @IsEmail()
    email?: string;

    @IsString()
    bioSummary?: string;
}
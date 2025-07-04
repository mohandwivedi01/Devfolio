import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "@nestjs/class-validator";
import { IsBoolean, Length } from "class-validator";

export class SignupDTO {    
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password should be at least 8 char.' })
    @MaxLength(32, { message: 'Password should not greater than 32 char.' })
    password: string;
}
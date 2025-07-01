import { IsNotEmpty } from "@nestjs/class-validator";
import { IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDTO {
    @IsString()
    @IsNotEmpty()
    id:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password should be at least 8 char.' })
    @MaxLength(32, { message: 'Password should not greater than 32 char.' })
    oldPassword: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password should be at least 8 char.' })
    @MaxLength(32, { message: 'Password should not greater than 32 char.' })
    password: string;
    newPassword: string;
}
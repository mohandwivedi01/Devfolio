import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from '@nestjs/class-validator';

export class SigninUserDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password should be at least 8 char.' })
  @MaxLength(32, { message: 'Password should not greater than 32 char.' })
  password: string;
}

export class LogoutUser {
    @IsString()
    @IsNotEmpty()
    userId: string;
}

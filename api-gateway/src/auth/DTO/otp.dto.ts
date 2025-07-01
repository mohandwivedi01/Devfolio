import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { IsEmail, Length, MaxLength, MinLength } from 'class-validator';

export enum IncidentType {
  ForgotPassword = 'Forgot Password',
  changeEmail = 'Change Email',
  Signup = 'Signup',
}

export class SendOtpDTP {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  incident: string;
}

export class VerifyOtpDTP {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  incident: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(6, 6, { message: 'OTP should be exactly 6 char.' })
  otp: string;
}

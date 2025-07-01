export enum IncidentType {
  ForgotPassword = 'Forgot Password',
  changeEmail = 'Change Email',
  Signup = 'Signup',
}

export interface SendOtpDTP {
  email: string;
  incident: string;
}

export interface VerifyOtpDTP {
  email: string;
  incident: string;
  otp: string;
}

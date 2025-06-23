import { ResponseDTO } from './common.dto';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
}

export interface Data {
  accessToken: string;
  user: UserDTO;
}

export interface SignupResponse extends ResponseDTO {
  data: Data;
}

export interface SignupResponseDTO {
  refreshToken: string;
  response: SignupResponse;
}

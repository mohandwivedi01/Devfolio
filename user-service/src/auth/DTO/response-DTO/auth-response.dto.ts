import { ResponseDTO } from './common.dto';

interface UserDTO {
  id: string;
  name: string;
  email: string;
  bioSummary?: string | null;
  profilePictureUrl?: string | null;
}

interface SignupResponseData {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

export type SignupResponseDTO = ResponseDTO<SignupResponseData>; 

export type UpdateUserResponseDTO = ResponseDTO<SignupResponseData>; 


interface SigninResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

export type SigninResponseDTO = ResponseDTO<SigninResponse>;

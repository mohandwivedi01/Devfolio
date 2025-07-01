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
  user: UserDTO;
}

export interface SignupResponseDTO extends ResponseDTO<SignupResponseData> {
  refreshToken: string;
} 

export type UpdateUserResponseDTO = ResponseDTO<SignupResponseData>; 


interface SigninResponse {
  accessToken: string;
  user: UserDTO;
}

export interface SigninResponseDTO extends  ResponseDTO<SigninResponse> {
  refreshToken: string;
}

import { ResponseDTO } from "./common.dto";

export type ReGenerateAccessTokenResponseDTO = ResponseDTO<{token: string}>

export interface ValidateUserDTO {
  userId: string;
  email: string;
  success: boolean;
}


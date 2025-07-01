export interface IValidateTokenDTO {
  userId: string;
  token: string;
}

export interface GenerateAccessTokenDTO {
  refreshToken: string; 
}
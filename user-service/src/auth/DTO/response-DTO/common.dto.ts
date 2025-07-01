export interface ResponseDTO<T>  {
    statusCode: number;
    message: string;
    data: T;
}

export interface SuccessResponseDTO {
  statusCode: number;
  message: string;
  success: boolean;
}
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { ISignupUserDTO } from './DTO/index';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'signup' })
  async signup(data: ISignupUserDTO) {
    try {
      const response = await this.authService.signup(data);
      return {
        statusCode: 200,
        message: 'User signed up successfully.',
        data: response,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new RpcException(error.message);
      }
      throw new RpcException('something went wrong while signing up.');
    }
  }
}

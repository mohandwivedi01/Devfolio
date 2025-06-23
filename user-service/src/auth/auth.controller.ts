import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { IAccessToken, ISigninUserDTO, ISignupUserDTO } from './DTO/index';
import { IUserChangePassword } from './DTO/changePassword.dto';
import { IUserInfoDTO } from './DTO/updateUser.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'signup' })
  async signup(data: ISignupUserDTO) {
    try {
      return await this.authService.signup(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new RpcException(error.message);
      }
      throw new RpcException('something went wrong while signing up.');
    }
  }

  @MessagePattern({ cmd: 'signin' })
  async signin(data: ISigninUserDTO) {
    try {
      return await this.authService.signin(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new RpcException(error.message);
      }
      throw new RpcException('something went wrong while signing up.');
    }
  }

  @MessagePattern({ cmd: 'changePassword' })
  async changePassword(data: IUserChangePassword) {
    try {
      return await this.authService.changePassword(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new RpcException(error.message);
      }
      throw new RpcException('something went wrong while signing up.');
    }
  }

  @MessagePattern({ cmd: 'updateUser' })
  async updateUser(data: IUserInfoDTO) {
    try {
      return await this.authService.updateUser(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new RpcException(error.message);
      }
      throw new RpcException('something went wrong while signing up.');
    }
  }
}

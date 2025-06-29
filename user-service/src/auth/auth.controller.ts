import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import {
  GenerateAccessTokenDTO,
  ISigninUserDTO,
  ISignupUserDTO,
  ILogoutUserDTO,
  IValidateTokenDTO,
} from './DTO/index';
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

  @MessagePattern({ cmd: 'validateUser' })
  async validateUser(data: IValidateTokenDTO) {
    try {
      return await this.authService.validateUser(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new RpcException(error.message);
      }
      throw new RpcException('something went wrong while signing up.');
    }
  }

  @MessagePattern({ cmd: 'getAccessToken' })
  async getAccessToken(data: GenerateAccessTokenDTO) {
    try {
      return await this.authService.reGenerateAccessToken(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new RpcException(error.message);
      }
      throw new RpcException('something went wrong generating access token.');
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

  @MessagePattern({ cmd: 'logout' })
  async logoutUser(data: ILogoutUserDTO) {
    try {
      return await this.authService.logoutUser(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new RpcException(error.message);
      }
      throw new RpcException('something went wrong while logout.');
    }
  }
}

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  ChangePasswordDTO,
  SendOtpDTP,
  SigninUserDTO,
  SignupDTO,
  UpdateUserDTO,
  VerifyOtpDTP,
} from './DTO/index';
import { Response } from 'express';
import { Request } from 'express';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
    @Inject('PROFILE_SERVICE')
    private readonly profileService: ClientProxy,
  ) {}

  @Post('signup')
  async signup(
    @Body() body: SignupDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const response = await firstValueFrom(
        this.userService.send({ cmd: 'signup' }, { ...body }),
      );
      const { refreshToken, ...result } = response;
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return result;
    } catch (error: any) {
      console.log(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('signin')
  async signin(
    @Body() data: SigninUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const response = await firstValueFrom(
        this.userService.send({ cmd: 'signin' }, { ...data }),
      );
      const { refreshToken, ...result } = response;

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 10000,
      });

      return result;
    } catch (error: any) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  
  @Get('generateAccessToken')
  @UseGuards(JwtAuthGuard)
  async generateAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const refreshToken = req.cookies?.['refresh_token'];
      console.log('Refresh Token:', refreshToken);
      if (!refreshToken) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Refresh token is required',
            success: false,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      return await firstValueFrom(
        this.userService.send({ cmd: 'getAccessToken' }, { refreshToken }),
      );
    } catch (error: any) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('updateUser')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Body() data: UpdateUserDTO) {
    try {
      return await firstValueFrom(
        this.userService.send({ cmd: 'updateUser' }, { ...data }),
      );
    } catch (error: any) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('changePassword')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() data: ChangePasswordDTO): Promise<any> {
    try {
      return await firstValueFrom(
        this.userService.send({ cmd: 'changePassword' }, { ...data }),
      );
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('logout/:id')
  @UseGuards(JwtAuthGuard)
  async logoutUser(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const response = await firstValueFrom(
        this.userService.send({ cmd: 'logout' }, { userId: id }),
      );
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      return response;
    } catch (error: any) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('sendOtp')
  @UseGuards(JwtAuthGuard)
  async sendOtp(@Body() data: SendOtpDTP) {
    try {
      return await firstValueFrom(
        this.profileService.send({ cmd: 'sendOtp' }, { ...data }),
      );
    } catch (error: any) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('verifyOTP')
  @UseGuards(JwtAuthGuard)
  async verifyOtp(@Body() data: VerifyOtpDTP) {
    try {
      return await firstValueFrom(
        this.profileService.send({ cmd: 'verifyOTP' }, { ...data }),
      );
    } catch (error: any) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  } 
}

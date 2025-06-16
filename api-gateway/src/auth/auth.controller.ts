import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SignupDTO } from './DTO/index';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USER_SERVICE') 
    private readonly userService: ClientProxy,
  ) {}

  @Post('signup')
  async signup(
    @Body() body: SignupDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      console.log(SignupDTO);
      const response = await firstValueFrom(
        this.userService.send({ cmd: 'signup' }, { ...body }),
      );
      res.cookie('refresh_token', response.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return response.response;
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

  @Get()
  test() {
    return "i'm running1234zxcvbnm.....";
  }
}

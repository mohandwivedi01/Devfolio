import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SignupDTO } from './DTO/index';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
  ) {}

  @Post('signup')
  async signup(@Body() body: SignupDTO) {
    try {
        console.log(SignupDTO);
      return await firstValueFrom(
        this.userService.send({ cmd: 'signup' }, { ...body }),
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

  @Get()
  test() {
    return "i'm running1234zxcvbnm.....";
  }
}

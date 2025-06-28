import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Patch,
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
    @Inject('PROFILE_SERVICE')
      private readonly profileService: ClientProxy,
  ) {}

  @Get('abc')
  async test() {
    try {
      console.log('**********');
      return await firstValueFrom(
        this.profileService.send({ cmd: 'testing' }, {}),
      )
    } catch (error: any) {
      console.log("error: ",error);
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

  @Post('signin')
  async signin(
    @Body() data: any,
  ): Promise<any> {
    try {
      return await firstValueFrom(
        this.userService.send(
          { cmd: 'signin' },
          { ...data },
        )
      )
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
  async updateUser(
    @Body() data: any,
  ): Promise<any> {
    try {
      return await firstValueFrom(
        this.userService.send(
          { cmd: 'updateUser' },
          { ...data },
        ),
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
  async changePassword(
    @Body() data:any,
  ):Promise<any>{
    try {
      return await firstValueFrom(
        this.userService.send(
          {cmd:'changePassword'},
          { ...data }
        ),
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
}

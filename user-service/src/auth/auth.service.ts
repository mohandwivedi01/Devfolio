import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/auth.schema';
import { IAccessToken, ISignupUserDTO, ISigninUserDTO } from './DTO/index';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAccessToken, ISignupUserDTO } from './DTO/index';
import {
  GenerateTokenResponse,
  SignupResponseDTO,
} from './DTO/response-DTO/index';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(data: IAccessToken): Promise<GenerateTokenResponse> {
    const accessToken = await this.jwtService.signAsync(data, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(data, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '24h',
    });

    return { accessToken, refreshToken };
  }

  async signup(data: ISignupUserDTO): Promise<SignupResponseDTO> {
    const existingUser = await this.userModel.findOne({
      email: data.email,
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = new this.userModel({
      email: data.email,
      name: data.name,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = await this.generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    user.refreshToken = hashedRefreshToken;

    const savedUser = await user.save();

    return {
      refreshToken,
      response: {
        statusCode: 200,
        message: 'User signed up successfully.',
        data: {
          accessToken,
          user: {
            id: savedUser._id.toString(),
            name: savedUser.name,
            email: savedUser.email,
          },
        },
      },
    };
  }


  async signin(data: ISigninUserDTO) {
    const existingUser = await this.userModel.findOne({
      email: data.email,
    });

    if (!existingUser) {
      throw new BadRequestException('User does not exists');
    }

    const matchPassword = await bcrypt.compare(
      data.password,
      existingUser.password,
    );
    if (!matchPassword) {
      throw new BadRequestException('Email or password is incorrect!');
    }
    const { accessToken, refreshToken } = await this.accessToken({
      id: user._id.toString(),
      email: user.email,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const savedUser = await this.userModel.findOneAndUpdate(existingUser._id, {
      refreshToken: hashedRefreshToken,
    });

    return {
      refreshToken,
      response: {
        statusCode: 200,
        message: 'User signed up successfully.',
        data: {
          accessToken,
          user: {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
          },
        },
      },
    };
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/auth.schema';
import { IAccessToken, ISignupUserDTO, ISigninUserDTO } from './DTO/index';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  GenerateTokenResponse,
  SignupResponseDTO,
} from './DTO/response-DTO/index';
import { IUserInfoDTO } from './DTO/updateUser.dto';
import { IUserChangePassword } from './DTO/changePassword.dto';

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

  async signin(data: ISigninUserDTO): Promise<any> {
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

    const { accessToken, refreshToken } = await this.generateToken({
      id: existingUser._id.toString(),
      email: existingUser.email,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

    const savedUser = await this.userModel.findOneAndUpdate(existingUser._id, {
      refreshToken: hashedRefreshToken,
    }, { new: true }).select('-password');

    return {
      refreshToken,
      response: {
        statusCode: 200,
        message: 'User signed up successfully.',
        data: {
          accessToken,
          user: savedUser,
        },
      },
    };
  }

  async changePassword(data: IUserChangePassword): Promise<any> {
    try {
      if (data.newPassword === data.oldPassword) {
        throw new BadRequestException(
          'New password cannot be same as old password.',
        );
      }
      const isUserExists = await this.userModel.findById(data.id);

      if (!isUserExists) {
        throw new NotFoundException('User not found.');
      }

      const isOldPasswordCorrect = bcrypt.compare(
        data.oldPassword,
        isUserExists.password,
      );

      if (!isOldPasswordCorrect) {
        throw new BadRequestException('Password is incorrect.');
      }

      const hashNewPassword = bcrypt.hash(data.newPassword, 12);
      const updatePassword = await this.userModel.findByIdAndUpdate(data.id, {
        $set: {
          password: hashNewPassword,
        },
      });

      return {
        statusCode: 200,
        message: 'User details updated successfully.',
        success: true,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUser(data: IUserInfoDTO): Promise<any> {
    try {
      const isUserExists = await this.userModel.findById(data.id);

      if (!isUserExists) {
        throw new NotFoundException('User not found.');
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(data.id, {
        $set: {
          name: data.name,
          email: data.email,
          bioSummary: data.bioSummary,
        },
      });

      return {
        statusCode: 200,
        message: 'User details updated successfully.',
        data: updatedUser,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

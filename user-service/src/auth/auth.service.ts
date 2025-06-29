import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/auth.schema';
import { ISignupUserDTO, ISigninUserDTO, IValidateTokenDTO, GenerateAccessTokenDTO, ILogoutUserDTO } from './DTO/index';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  ReGenerateAccessTokenResponseDTO,
  SigninResponseDTO,
  SignupResponseDTO,
  UpdateUserResponseDTO,
  ValidateUserDTO,
} from './DTO/response-DTO/index';
import { IUserInfoDTO } from './DTO/updateUser.dto';
import { IUserChangePassword } from './DTO/changePassword.dto';
import { SuccessResponseDTO } from './DTO/response-DTO/common.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async reGenerateAccessToken(data: GenerateAccessTokenDTO): Promise<ReGenerateAccessTokenResponseDTO> {
    const { refreshToken } = data;
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    const user = await this.userModel.findById(payload.userId);

    if (!user || user.refreshToken) {
      throw new NotFoundException(
        'Refresh token not found or user does not exist.',
      );
    }

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!tokenMatches) {
      throw new UnauthorizedException('Refresh token mismatch.');
    }

    const newAccessToken = await this.jwtService.signAsync(
      {
        userId: user._id,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: 'id',
      },
    );

    return {
      statusCode: 200,
      message: 'Access token fetched successfully.',
      data: {
        token: newAccessToken,
      },
    };
  }

  async validateUser(data: IValidateTokenDTO): Promise<ValidateUserDTO> {
    const { userId, token } = data;

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch (error) {
      console.error('Token validation error: ', error.message);
    }

    if (user._id.toString() !== payload.userId) {
      throw new BadRequestException('Invalid token');
    }

    return {
      userId: user._id.toString(),
      email: user.email,
      success: true,
    };
  }

  async signup(data: ISignupUserDTO): Promise<SignupResponseDTO> {
    const existingUser = await this.userModel.findOne({
      email: data.email,
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email id');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = new this.userModel({
      email: data.email,
      name: data.name,
      password: hashedPassword,
    });

    const accessToken = await this.jwtService.signAsync(
      {
        userId: user._id,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '1d',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        userId: user._id,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '30d',
      },
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    user.refreshToken = hashedRefreshToken;

    const savedUser = await user.save();

    return {
      statusCode: 200,
      message: 'User signed up successfully.',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: savedUser._id.toString(),
          name: savedUser.name,
          email: savedUser.email,
        },
      },
    };
  }

  async signin(data: ISigninUserDTO): Promise<SigninResponseDTO> {
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

    const accessToken = await this.jwtService.signAsync(
      {
        userId: existingUser._id,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '1d',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        userId: existingUser._id,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '30d',
      },
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

    const savedUser = await this.userModel.findOneAndUpdate(
      existingUser._id,
      {
        refreshToken: hashedRefreshToken,
      },
      { new: true },
    );

    if (!savedUser) {
      throw new InternalServerErrorException('Something went wrong while signing up.');
    }

    return {
      statusCode: 200,
      message: 'User signed n up successfully.',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: (savedUser._id).toString(),
          name: savedUser.name,
          email: savedUser.email,
          bioSummary: savedUser?.bioSummary ?? null,
          profilePictureUrl: savedUser?.profilePictureUrl ?? null,
        },
      },
    };
  }

  async changePassword(data: IUserChangePassword): Promise<SuccessResponseDTO> {
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

  async updateUser(data: IUserInfoDTO): Promise<UpdateUserResponseDTO | any> {
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

      if (!updatedUser) {
      throw new InternalServerErrorException('Something went wrong while signing up.');
    }

      return {
        statusCode: 200,
        message: 'User details updated successfully.',
        data: {
          id: (updatedUser._id).toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          bioSummary: updatedUser?.bioSummary ?? null,
          profilePictureUrl: updatedUser?.profilePictureUrl ?? null,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async logoutUser(data: ILogoutUserDTO): Promise<SuccessResponseDTO> {
    const { userId } = data;
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    user.refreshToken = '';
    await user.save();

    return {
      statusCode: 200,
      message: 'User logged out successfully.',
      success: true,
    };
  }
}

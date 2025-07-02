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
import {
  ISignupUserDTO,
  ISigninUserDTO,
  IValidateTokenDTO,
  GenerateAccessTokenDTO,
  ILogoutUserDTO,
} from './DTO/index';
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
import { IncidentType, SendOtpDTP, VerifyOtpDTP } from './DTO/otp.dto';
import { RedisHelper } from 'src/redis/redis.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly redisHelper: RedisHelper,
  ) {}

  async reGenerateAccessToken(
    data: GenerateAccessTokenDTO,
  ): Promise<ReGenerateAccessTokenResponseDTO> {
    const { refreshToken } = data;
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    const user = await this.userModel.findById(payload.id);
    
    if (!user || !user.refreshToken) {
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
        id: user._id,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '1d',
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

  async signup(data: ISignupUserDTO): Promise<SignupResponseDTO> {
    const { email, name, password } = data;
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email id');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new this.userModel({
      email,
      name,
      password: hashedPassword,
    });

    const accessToken = await this.jwtService.signAsync(
      {
        id: user._id,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '1d',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        id: user._id,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      },
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    user.refreshToken = hashedRefreshToken;

    const savedUser = await user.save();

    return {
      refreshToken,
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
        id: existingUser._id,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '1d',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        id: existingUser._id,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
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
      throw new InternalServerErrorException(
        'Something went wrong while signing up.',
      );
    }

    return {
      refreshToken,
      statusCode: 200,
      message: 'User signed n up successfully.',
      data: {
        accessToken,
        user: {
          id: savedUser._id.toString(),
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
        throw new InternalServerErrorException(
          'Something went wrong while signing up.',
        );
      }

      return {
        statusCode: 200,
        message: 'User details updated successfully.',
        data: {
          id: updatedUser._id.toString(),
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
    console.log('User ID for logout:', data);
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

    if (user._id.toString() !== payload.id) {
      throw new BadRequestException('Invalid token');
    }

    return {
      userId: user._id.toString(),
      email: user.email,
      success: true,
    };
  }

  async sendOTP(data: SendOtpDTP): Promise<SuccessResponseDTO> {
    const { email, incident } = data;

    const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new NotFoundException('user already exist with this email.');
    }

    const { expired, ttl } = await this.redisHelper.otpValidate(
      `${email}${incident}`,
    );

    if (!expired) {
      throw new BadRequestException(
        `Please wait for ${ttl} seconds before re-sending OTP.`,
      );
    }

    await this.redisHelper.set(`${email}${incident}`, otp, 5 * 60);

    console.log('-----------OTP----------: ', otp);

    //send email to user with OTP.

    return {
      statusCode: 200,
      message: 'OTP sended successfully.',
      success: true,
    };
  }

  async verifyOTP(data: VerifyOtpDTP): Promise<SuccessResponseDTO> {
    const { email, incident, otp } = data;

    const isOTPValid = await this.verifyOtp({ email, incident, otp });

    if (!isOTPValid) {
      throw new BadRequestException('Invalid OTP.');
    }

    return {
      statusCode: 200,
      message: 'OTP sended successfully.',
      success: true,
    };
  }

  async verifyOtp({
    email,
    incident,
    otp,
  }: VerifyOtpDTP): Promise<boolean>{
    const fetchedOTP = await this.redisHelper.get(`${email}${incident}`);
    
    if (!fetchedOTP) {
      throw new BadRequestException('OTP not found.');
    }

    if (fetchedOTP === otp) {
      await this.redisHelper.delete(`${email}${incident}`);
      return true;
    } else {
      throw new BadRequestException('Invalid OTP.');
    }
  }
}
 
import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern({ cmd: 'testing' })
  async getUserDetails() {
    try {
      return this.profileService.fetchUserGithubData();
    } catch (error) {
      if (error instanceof Error) {
        throw new RpcException(error.message);
      }
      throw new RpcException('something went wrong while signing up.');
    }
  }
}

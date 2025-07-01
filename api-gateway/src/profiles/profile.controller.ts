import { Controller, Get, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Controller('profile')
export class ProfileController {
    constructor(
        @Inject('PROFILE_SERVICE')
        private readonly profileService: ClientProxy,
    ) {}

    @Get('user')
    async getUsers() {
        try {
            console.log('**********');
            return await firstValueFrom(
                this.profileService.send({
                    cmd: 'getUser'
                }, {}),
            );
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
}
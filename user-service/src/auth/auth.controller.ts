import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { MessagePattern, RpcException } from "@nestjs/microservices";

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @MessagePattern({ cmd: 'userSignup' })
    async signup(data: {username: string; password: string }) {
        try {
            console.log('******inside auth controller*****');
            return await this.authService.signup(data);
        } catch (error) {
            console.log('******inside auth controller123*****');
            if (error instanceof Error) {
                throw new RpcException(error.message)
            }
            throw new RpcException('something went wrong while signing up.');
        }
    }
}
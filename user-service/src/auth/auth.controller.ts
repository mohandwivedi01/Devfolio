import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { MessagePattern, RpcException } from "@nestjs/microservices";
import { ISignupUserDTO } from "./DTO/index"

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    // @MessagePattern({ cmd: 'userSignup' })
    // async signup1(data: {username: string; password: string }) {
    //     try {
    //         console.log('******inside auth controller*****');
    //         return await this.authService.signup(data);
    //     } catch (error) {
    //         console.log('******inside auth controller123*****');
    //         if (error instanceof Error) {
    //             throw new RpcException(error.message)
    //         }
    //         throw new RpcException('something went wrong while signing up.');
    //     }
    // }

    @MessagePattern({ cmd: 'signup' })
    async signup(data: ISignupUserDTO) {
        try {
            console.log('******inside auth controller*****');
            console.log('******auth controller data*****', data);
            const response =  await this.authService.signup(data);
            console.log('******auth controller response*****', response);
            return response;
        } catch (error) {
            console.log('******inside auth controller error*****', error);
            if (error instanceof Error) {
                throw new RpcException(error.message)
            }
            throw new RpcException('something went wrong while signing up.');
        }
    }
}
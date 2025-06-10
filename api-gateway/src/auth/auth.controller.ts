import { Controller, Get, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Controller('auth')
export class AuthController {
    constructor(
        @Inject('USER_SERVICE')
        private readonly userService: ClientProxy,
    ) {}

    @Post('signup')
    async signup() {
        try {
            console.log('******inside API getway controller*****');
            return await firstValueFrom(
                this.userService.send(
                    { cmd: 'signup' },
                    { email: 'mohan.dwivedi@gmail.com', name: "Mohan Dwwivedi", password: 'password123' } // Example payload, replace with actual data
                )
            )
        } catch (error: any) {
            console.error('Error during signup:', error);
            throw error; // Re-throw the error for proper handling            
        }
    }

    @Post('signup1')
    async signup1(): Promise<any> {
        try {
            console.log('******inside API getway controller*****');
            const response = await firstValueFrom(
                this.userService.send(
                    { cmd: 'userSignup' },
                    { username: 'Mohan Dev', password: 'password123' } // Example payload, replace with actual data
                )
            )
            console.log('******auth controller response*****', response);
            return response;
        } catch (error: any) {
            console.error('Error during signup:', error);
            throw error; // Re-throw the error for proper handling            
        }
    }

    @Get()
    test() {
        return "i'm running1234zxcvbnm.....";
    }
}
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {

    async signup(data: {username: string; password: string }): Promise<{ message: string }> {
        try {
            console.log('******inside auth service*****');
            return { message: `User ${data.username} signed up successfully` };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
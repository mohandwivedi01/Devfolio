import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schema/auth.schema";
import { ISignupUserDTO } from './DTO/index';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>
    ) {}

    async signup1(data: {username: string; password: string }): Promise<{ message: string }> {
        try {
            console.log('******inside auth service*****');
            return { message: `User ${data.username} signed up successfully` };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async signup(data: ISignupUserDTO) {
        console.log("******auth service data*****", data);
        const user = new this.userModel(data);
        console.log("****user*****: ", user);
        return user.save();
    }
}
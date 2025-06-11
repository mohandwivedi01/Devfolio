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

    async signup(data: ISignupUserDTO) {
        const existingUser = await this.userModel.findOne({
            email: data.email
        })

        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const user = new this.userModel(data);
        return user.save();
    }
}
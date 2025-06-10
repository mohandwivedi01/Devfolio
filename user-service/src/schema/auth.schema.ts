import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    @Prop({
        required: true,
        unique: true,
        type: String,
    })
    email: string

    @Prop({
        required: true,
        type: String,
    })
    name: string
    
    @Prop({
        required: true,
        type: String,
    })
    password: string

    @Prop({
        type: String,
    })
    bioSummary: string

    @Prop({
        type: String,
    })
    profilePictureUrl: string
}

export const UserSchema = SchemaFactory.createForClass(User);
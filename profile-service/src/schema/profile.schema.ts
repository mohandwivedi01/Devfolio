import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Github } from './githubSchema/github.schema';

@Schema()
export class Profile {
  user: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Github',
    default: null,
  })
  gitHub: Github;
}

export const profileSchema = SchemaFactory.createForClass(Profile);

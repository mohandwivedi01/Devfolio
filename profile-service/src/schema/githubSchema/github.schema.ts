import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Repository } from './repository.schema';
import { Contribution } from './contribution.schema';

@Schema({ timestamps: true })
export class Github extends Document {
  @Prop({ required: true, unique: true, index: true })
  userName: string;

  @Prop() name: string;
  @Prop() email: string;
  @Prop() avatarUrl: string;
  @Prop() bio: string;
  @Prop() location: string;
  @Prop() companyName: string;
  @Prop() websiteOrBlog: string;
  @Prop() openToWork: boolean;
  @Prop() numberOfFollowing: number;
  @Prop() numberOfFollowers: number;
  @Prop() joiningDate: Date;
  @Prop() numberOfStars: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repository' }],
    default: [],
  })
  repositories: Repository[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contribution' }],
    default: [],
  })
  contributions: Contribution[];
}

export const githubSchema = SchemaFactory.createForClass(Github);

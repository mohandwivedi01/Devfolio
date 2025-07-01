import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Optional but recommended
export type ContributionDocument = Contribution & Document;

@Schema()
export class Contribution {
  @Prop({ required: true })
  repoName: string;

  @Prop({ required: true })
  repoUrl: string;

  @Prop({ default: 0 })
  numberOfCommits: number;

  @Prop({ default: 0 })
  numberOfPRs: number;

  @Prop()
  dateOfCommits: Date;
}

export const contributionSchema = SchemaFactory.createForClass(Contribution);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Language } from './language.schema';
import mongoose, { Document } from 'mongoose';

// Optional: Type safety
export type RepositoryDocument = Repository & Document;

@Schema()
export class Repository {
  @Prop({ required: true })
  repoName: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  numberOfFork: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
    default: [],
  })
  languages: Language[];
}

export const repositorySchema = SchemaFactory.createForClass(Repository);

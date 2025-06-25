import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Optional but recommended
export type LanguageDocument = Language & Document;

@Schema()
export class Language {
  @Prop({ required: true, trim: true, lowercase: true })
  languageName: string;
}

export const languageSchema = SchemaFactory.createForClass(Language);

import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: ['admin', 'supervisor', 'tech'],
    default: 'tech',
  })
  role: string;

  @Prop({
    required: true,
    enum: ['edmonton', 'calgary', 'saskatoon', 'regina', 'prince-george'],
  })
  city: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

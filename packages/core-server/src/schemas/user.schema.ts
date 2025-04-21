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

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'City', required: true })
  city: Types.ObjectId;

  @Prop({
    required: true,
    default: true,
  })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

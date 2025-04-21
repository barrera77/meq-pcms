import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProvinceDocument = Province & Document;

@Schema()
export class Province {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);

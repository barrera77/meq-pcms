import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CityDocument = City & Document;

@Schema()
export class City {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Province', required: true })
  province: Types.ObjectId; //or perhaps is just string?, planning to use it as FK for relationship with the Province table
}

export const CitySchema = SchemaFactory.createForClass(City);

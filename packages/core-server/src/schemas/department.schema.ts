import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DepartmentDocument = Department & Document;

@Schema()
export class Department {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);

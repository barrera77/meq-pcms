import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  department: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  user: Types.ObjectId;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

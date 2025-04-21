import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employee, EmployeeDocument } from 'src/schemas/employee.schema';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}

  async findByEmail(employeeId: string): Promise<Employee | null> {
    return this.employeeModel.findById(employeeId).exec();
  }

  async findByName(name: string): Promise<Employee | null> {
    return this.employeeModel.findOne({ name }).exec();
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeModel.find().exec();
  }

  async findByUserId(userId: string): Promise<Employee | null> {
    return this.employeeModel.findOne({ user: userId }).exec();
  }

  async create(name: string, department: Types.ObjectId): Promise<Employee> {
    const existing = await this.findByName(name);

    if (existing) {
      throw new Error(`Employee with name "${name}" already exists`);
    }
    const newEmployee = new this.employeeModel({ name });
    return newEmployee.save();
  }
}

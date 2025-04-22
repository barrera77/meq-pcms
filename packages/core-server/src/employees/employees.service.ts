import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employee, EmployeeDocument } from 'src/schemas/employee.schema';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}

  async findByEmail(employeeId: string): Promise<Employee | null> {
    return this.employeeModel.findById(employeeId).exec();
  }

  async findByNameOrLastName(term: string): Promise<EmployeeDocument[]> {
    return this.employeeModel
      .find({
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { lastName: { $regex: term, $options: 'i' } },
        ],
      })
      .exec();
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeModel.find().exec();
  }

  async findByUserRole(role: string): Promise<EmployeeDocument[]> {
    return this.employeeModel
      .find()
      .populate({ path: 'user', match: { role } })
      .exec()
      .then((employees) => employees.filter((e) => e.user));
  }

  async create(
    name: string,
    lastName: string,
    department: Types.ObjectId,
  ): Promise<Employee> {
    const existing = await this.findByNameOrLastName(name);

    if (existing) {
      throw new Error(
        `Employee with name "${name} ${lastName}" already exists`,
      );
    }
    const newEmployee = new this.employeeModel({ name, lastName, department });
    return newEmployee.save();
  }
}

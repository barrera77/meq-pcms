import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee, EmployeeDocument } from 'src/schemas/employee.schema';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Department } from 'src/schemas/department.schema';
import { Roles } from 'src/auth/roles.decorator';

@Controller('employees')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles('admin')
  @Get()
  findAll(): Promise<Employee[]> {
    return this.employeesService.findAll();
  }

  @Roles('admin')
  @Get('search/:term')
  async searchEmployee(
    @Param('term') term: string,
  ): Promise<EmployeeDocument[]> {
    const results = await this.employeesService.findByNameOrLastName(term);

    if (!results.length) {
      throw new NotFoundException(`Employee with the name ${term} not found`);
    }
    return results;
  }

  @Get('role/:role')
  async findByUserRole(
    @Param('role') role: string,
  ): Promise<EmployeeDocument[]> {
    const employees = await this.employeesService.findByUserRole(role);

    if (!employees.length) {
      throw new NotFoundException(`No employees found with the role ${role}`);
    }

    return employees;
  }

  @Roles('admin')
  @Post('create-employee')
  async create(
    @Body()
    body: {
      name: string;
      lastName: string;
      department: Types.ObjectId;
    },
  ): Promise<Employee> {
    try {
      return await this.employeesService.create(
        body.name,
        body.lastName,
        body.department,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  return;
}

import { IsNotEmpty, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsMongoId()
  @IsNotEmpty()
  departmentId: string;

  @IsMongoId()
  @IsOptional()
  user?: string;
}

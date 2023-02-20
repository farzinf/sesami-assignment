import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsDateString()
  start: Date;

  @ApiProperty()
  @IsDateString()
  end: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  createdAt: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  updatedAt: Date;
}

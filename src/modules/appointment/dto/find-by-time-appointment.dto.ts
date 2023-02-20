import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class FindByTimeAppointmentDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  date: Date;
}

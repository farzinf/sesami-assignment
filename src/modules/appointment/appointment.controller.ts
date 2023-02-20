import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointment.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  CreateAppointmentDto,
  FindByTimeAppointmentDto,
  IsFreeAppointmentDto,
} from './dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('/')
  create(@Body() data: CreateAppointmentDto): Promise<boolean> {
    return this.appointmentService.create(data);
  }

  @Get('/')
  find(@Query() data: FindByTimeAppointmentDto) {
    return this.appointmentService.findByTime(data.date);
  }

  @Get('/findall')
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get('/isFree')
  findByTime(@Query() data: IsFreeAppointmentDto): Promise<Appointment> {
    return this.appointmentService.isTimeFree(data.start, data.end);
  }
}

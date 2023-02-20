import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  providers: [AppointmentService],
})
export class AppointmentModule {}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentInterface } from './appointment.interface';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  /**
   * check if appointment time (by start and end) is free return null
   * if no return appointment that exist on that time.
   *
   * @param start time of the appointment
   * @param end time of the appointment
   * @returns appointment
   */
  async isTimeFree(start: Date, end: Date): Promise<Appointment> {
    const startTime = new Date(start),
      endTime = new Date(end);

    const appointment = await this.appointmentRepository.find({
      where: [
        {
          start: Between(startTime, endTime),
        },
        {
          end: Between(startTime, endTime),
        },
        {
          start: LessThanOrEqual(startTime),
          end: MoreThanOrEqual(startTime),
        },
        {
          start: LessThanOrEqual(endTime),
          end: MoreThanOrEqual(endTime),
        },
      ],
    });

    // const appointment = await this.appointmentRepository
    //   .createQueryBuilder()
    //   // .from(Appointment)
    //   .where([
    //     {
    //       start: Between(startTime, endTime),
    //     },
    //     {
    //       end: Between(startTime, endTime),
    //     },
    //     {
    //       start: MoreThanOrEqual(startTime),
    //       end: LessThanOrEqual(startTime),
    //     },
    //     {
    //       start: MoreThanOrEqual(endTime),
    //       end: LessThanOrEqual(endTime),
    //     },
    //   ])
    // .getOne();

    return appointment[0];
  }
}

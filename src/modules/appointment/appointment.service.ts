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

  async create(data: AppointmentInterface): Promise<boolean> {
    const appointment = await this.isTimeFree(data.start, data.end);

    // TODO: check start time and end time must be after current time
    // Time conflict with existing appointment
    if (appointment && (!data.id || data.id != appointment.id)) {
      throw new BadRequestException(
        `Time conflict appointment id ${appointment.id} from ${appointment.start} to ${appointment.end}`,
      );
    }

    await this.appointmentRepository
      .createQueryBuilder()
      .insert()
      .into(Appointment)
      .values([
        {
          id: data.id,
          start: data.start,
          end: data.end,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        },
      ])
      .orUpdate(['start', 'end', 'updatedAt'], ['id'])
      .execute();
    return true;
  }

}

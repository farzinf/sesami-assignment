import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';
import { Repository, DataSource } from 'typeorm';

describe('Appointment Service', () => {
  let testingModule: TestingModule,
    service: AppointmentService,
    repository: Repository<Appointment>,
    dataSource: DataSource;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: getRepositoryToken(Appointment),
          useClass: Repository,
        },
      ],
    }).compile();

    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Appointment],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();

    repository = dataSource.getRepository(Appointment);
    service = new AppointmentService(repository);
    return dataSource;
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create new appointment', async () => {
      expect(
        await service.create({
          id: 1,
          start: new Date('2023-01-01T10:00:00.000Z'),
          end: new Date('2023-01-01T11:00:00.000Z'),
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        }),
      ).toBe(true);
    });
    // it('should throw conflict error', async () => {
    //   await service.create({
    //     id: 1,
    //     start: new Date('2023-01-01T10:00:00.000Z'),
    //     end: new Date('2023-01-01T11:00:00.000Z'),
    //     createdAt: new Date(Date.now()),
    //     updatedAt: new Date(Date.now()),
    //   });
    //   expect(
    //     await service.create({
    //       id: 2,
    //       start: new Date('2023-01-01T10:00:00.000Z'),
    //       end: new Date('2023-01-01T11:00:00.000Z'),
    //       createdAt: new Date(Date.now()),
    //       updatedAt: new Date(Date.now()),
    //     }),
    //   ).rejects.toThrow(
    //     new RegExp('(.*?)Time conflict appointment id (.?) from (.*?) to (.*)'),
    //   );
    // });
  });

  describe('is time free', () => {
    const appointment = {
      id: 1,
      start: new Date('2023-01-01T02:00:00.000Z'),
      end: new Date('2023-01-01T06:00:00.000Z'),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    };

    beforeEach(async () => {
      await service.create(appointment);
    });
    afterEach(async () => {
      await repository.delete({});
    });

    it('should be time free(exist 2-6 new 0-1)', async () => {
      const start = new Date('2023-01-01T00:00:00.000Z'),
        end = new Date('2023-01-01T01:00:00.000Z');
      expect(await service.isTimeFree(start, end)).toBeUndefined();
    });
    it('should be time free(exist 2-6 new 7-8)', async () => {
      const start = new Date('2023-01-01T07:00:00.000Z'),
        end = new Date('2023-01-01T08:00:00.000Z');
      expect(await service.isTimeFree(start, end)).toBeUndefined();
    });
    it('should be time not free(exist 2-6 new 1-7)', async () => {
      const start = new Date('2023-01-01T01:00:00.000Z'),
        end = new Date('2023-01-01T07:00:00.000Z');
      expect(await service.isTimeFree(start, end)).toHaveProperty(
        'id',
        appointment.id,
      );
    });
    it('should be time not free(exist 2-6 new 1-4)', async () => {
      const start = new Date('2023-01-01T01:00:00.000Z'),
        end = new Date('2023-01-01T04:00:00.000Z');
      expect(await service.isTimeFree(start, end)).toHaveProperty(
        'id',
        appointment.id,
      );
    });
    it('should be time not free(exist 2-6 new 3-4)', async () => {
      const start = new Date('2023-01-01T03:00:00.000Z'),
        end = new Date('2023-01-01T04:00:00.000Z');
      expect(await service.isTimeFree(start, end)).toHaveProperty(
        'id',
        appointment.id,
      );
    });
    it('should be time not free(exist 2-6 new 3-8)', async () => {
      const start = new Date('2023-01-01T03:00:00.000Z'),
        end = new Date('2023-01-01T08:00:00.000Z');
      expect(await service.isTimeFree(start, end)).toHaveProperty(
        'id',
        appointment.id,
      );
    });
  });
});

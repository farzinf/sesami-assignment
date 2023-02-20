import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AppointmentController } from './appointment.controller';
import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointment.service';

describe('AppointmentController', () => {
  let testingModule: TestingModule,
    controller: AppointmentController,
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
      controllers: [AppointmentController],
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
    controller = new AppointmentController(service);
    return dataSource;
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'sesami-test-db',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: false,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([Appointment]),
      ],
      providers: [AppointmentService],
      controllers: [AppointmentController],
    }).compile();

    controller = module.get<AppointmentController>(AppointmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('create', () => {
  //   it('should create new appointment', () => {
  //     expect(
  //       controller.create({
  //         id: 1,
  //         start: new Date('2023-02-19T10:00:00.000Z'),
  //         end: new Date('2023-02-19T11:00:00.000Z'),
  //         createdAt: new Date(Date.now()),
  //         updatedAt: new Date(Date.now()),
  //       }),
  //     ).resolves.toBe(true);
  //     expect(
  //       controller.create({
  //         id: 1,
  //         start: new Date('2023-02-19T10:00:00.000Z'),
  //         end: new Date('2023-02-19T11:00:00.000Z'),
  //         createdAt: new Date(Date.now()),
  //         updatedAt: new Date(Date.now()),
  //       }),
  //     ).resolves.toEqual(true);
  //   });
  // });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(appController.getHello()).toBe('Hello World!');
  //   });
  // });
});

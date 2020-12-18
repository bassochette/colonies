import { Test, TestingModule } from '@nestjs/testing';
import { WorkHandler } from './work.handler';
import { WorkModule } from '../../../work/work.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test-utils/mongo/MongooseTestModule';

describe('WorkHandler', () => {
  let workHandler: WorkHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule('work handler'), WorkModule],
      providers: [WorkHandler],
    }).compile();

    workHandler = module.get<WorkHandler>(WorkHandler);
  });

  afterEach(async () => {
    await closeInMongodConnection('work handler');
  });

  it('should be defined', () => {
    expect(workHandler).toBeDefined();
  });

  it('match the command "colonie work" case insensitive', () => {
    expect(workHandler.test('colonie work')).toBeTruthy();
    expect(workHandler.test('CoLONie wORK')).toBeTruthy();
    expect(workHandler.test('the command colonie work')).toBeFalsy();
  });
});

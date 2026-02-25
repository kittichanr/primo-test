import { Test, TestingModule } from '@nestjs/testing';
import { EncryptController, DecryptController } from './app.controller';
import { AppService } from './app.service';

const mockEncryptResult = {
  successful: true,
  error_code: null,
  data: { data1: 'encrypted-key-base64', data2: 'encrypted-payload-hex' },
};

const mockDecryptResult = {
  successful: true,
  error_code: null,
  data: { payload: 'original text' },
};

describe('EncryptController', () => {
  let controller: EncryptController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EncryptController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getEncrypt: jest.fn().mockResolvedValue(mockEncryptResult),
          },
        },
      ],
    }).compile();

    controller = module.get<EncryptController>(EncryptController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call appService.getEncrypt with the payload', async () => {
    const payload = { payload: 'hello world' };
    const result = await controller.getEncrypt(payload);

    expect(appService.getEncrypt).toHaveBeenCalledWith(payload);
    expect(result).toEqual(mockEncryptResult);
  });

  it('should return successful response with data1 and data2', async () => {
    const result = await controller.getEncrypt({ payload: 'test' });

    expect(result.successful).toBe(true);
    expect(result.error_code).toBeNull();
    expect(result.data?.data1).toBe('encrypted-key-base64');
    expect(result.data?.data2).toBe('encrypted-payload-hex');
  });
});

describe('DecryptController', () => {
  let controller: DecryptController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DecryptController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getDecrypt: jest.fn().mockResolvedValue(mockDecryptResult),
          },
        },
      ],
    }).compile();

    controller = module.get<DecryptController>(DecryptController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call appService.getDecrypt with data1 and data2', async () => {
    const data = { data1: 'encrypted-key', data2: 'encrypted-payload' };
    const result = await controller.getDecrypt(data);

    expect(appService.getDecrypt).toHaveBeenCalledWith(data);
    expect(result).toEqual(mockDecryptResult);
  });

  it('should return successful response with decrypted payload', async () => {
    const result = await controller.getDecrypt({
      data1: 'encrypted-key',
      data2: 'encrypted-payload',
    });

    expect(result.successful).toBe(true);
    expect(result.error_code).toBeNull();
    expect(result.data?.payload).toBe('original text');
  });
});

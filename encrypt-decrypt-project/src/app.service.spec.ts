import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import * as fs from 'fs';
import { generateKeyPairSync } from 'crypto';

describe('AppService', () => {
  let service: AppService;
  let privateKey: string;
  let publicKey: string;

  beforeAll(() => {
    const keyPair = generateKeyPairSync('rsa', {
      modulusLength: 1024,
      publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
    });
    privateKey = keyPair.privateKey;
    publicKey = keyPair.publicKey;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);

    jest
      .spyOn(fs, 'readFileSync')
      .mockImplementation((path: fs.PathOrFileDescriptor) => {
        if (path.toString().includes('priv')) return privateKey;
        if (path.toString().includes('pub')) return publicKey;
        return '';
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEncrypt', () => {
    it('should return a successful response', async () => {
      const result = await service.getEncrypt({ payload: 'hello world' });

      expect(result.successful).toBe(true);
      expect(result.error_code).toBeNull();
    });

    it('should return data with data1 and data2 as strings', async () => {
      const result = await service.getEncrypt({ payload: 'hello world' });

      expect(result.data).toBeDefined();
      expect(typeof result.data?.data1).toBe('string');
      expect(typeof result.data?.data2).toBe('string');
      expect(result.data?.data1.length).toBeGreaterThan(0);
      expect(result.data?.data2.length).toBeGreaterThan(0);
    });

    it('should read the private key file', async () => {
      await service.getEncrypt({ payload: 'test' });

      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('rsa_1024_priv.pem'),
        { encoding: 'utf8' },
      );
    });

    it('should produce different data2 for different payloads', async () => {
      const result1 = await service.getEncrypt({ payload: 'message one' });
      const result2 = await service.getEncrypt({ payload: 'message two' });

      expect(result1.data?.data2).not.toBe(result2.data?.data2);
    });

    it('should return data1 in base64 format', async () => {
      const result = await service.getEncrypt({ payload: 'test' });
      const base64Regex = /^[A-Za-z0-9+/]+=*$/;

      expect(base64Regex.test(result.data!.data1)).toBe(true);
    });
  });

  describe('getDecrypt', () => {
    it('should decrypt and return the original payload', async () => {
      const originalPayload = 'secret message';
      const encrypted = await service.getEncrypt({ payload: originalPayload });

      const decrypted = await service.getDecrypt({
        data1: encrypted.data!.data1,
        data2: encrypted.data!.data2,
      });

      expect(decrypted.successful).toBe(true);
      expect(decrypted.error_code).toBeNull();
      expect(decrypted.data?.payload).toBe(originalPayload);
    });

    it('should round-trip encrypt and decrypt special characters', async () => {
      const originalPayload = 'hello! @#$%^&*() 123 Thai: สวัสดี';
      const encrypted = await service.getEncrypt({ payload: originalPayload });

      const decrypted = await service.getDecrypt({
        data1: encrypted.data!.data1,
        data2: encrypted.data!.data2,
      });

      expect(decrypted.data?.payload).toBe(originalPayload);
    });

    it('should round-trip encrypt and decrypt a long payload', async () => {
      const originalPayload = 'a'.repeat(500);
      const encrypted = await service.getEncrypt({ payload: originalPayload });

      const decrypted = await service.getDecrypt({
        data1: encrypted.data!.data1,
        data2: encrypted.data!.data2,
      });

      expect(decrypted.data?.payload).toBe(originalPayload);
    });

    it('should read the public key file', async () => {
      const encrypted = await service.getEncrypt({ payload: 'test' });
      jest.clearAllMocks();

      jest
        .spyOn(fs, 'readFileSync')
        .mockImplementation((path: fs.PathOrFileDescriptor) => {
          if (path.toString().includes('priv')) return privateKey;
          if (path.toString().includes('pub')) return publicKey;
          return '';
        });

      await service.getDecrypt({
        data1: encrypted.data!.data1,
        data2: encrypted.data!.data2,
      });

      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('rsa_1024_pub.pem'),
        { encoding: 'utf8' },
      );
    });
  });
});

import { Injectable } from '@nestjs/common';
import {
  DataDto,
  PayloadDto,
  ResponseDecryptDto,
  ResponseEncryptDto,
} from './dto';
import {
  createCipheriv,
  randomBytes,
  createDecipheriv,
  publicDecrypt,
  privateEncrypt,
  createHash,
} from 'crypto';
import * as fs from 'fs';

const iv = randomBytes(16);

@Injectable()
export class AppService {
  async getEncrypt(payload: PayloadDto): Promise<ResponseEncryptDto> {
    const randomKey = (Math.random() + 1).toString(36).substring(7);
    const key = createHash('sha512')
      .update(randomKey)
      .digest('hex')
      .substring(0, 32);
    const cipher = createCipheriv('aes-256-cbc', key, iv);

    let data2 = cipher.update(payload.payload, 'utf8', 'hex');
    data2 += cipher.final('hex');

    const privateKey = fs.readFileSync(
      process.cwd() + '/key/rsa_1024_priv.pem',
      {
        encoding: 'utf8',
      },
    );
    const data1 = privateEncrypt(privateKey, Buffer.from(key, 'utf8')).toString(
      'base64',
    );

    return {
      successful: true,
      error_code: null,
      data: {
        data1: data1, // key
        data2: data2, // payload
      },
    };
  }
  async getDecrypt(data: DataDto): Promise<ResponseDecryptDto> {
    // decrypt key
    const publicKey = fs.readFileSync(process.cwd() + '/key/rsa_1024_pub.pem', {
      encoding: 'utf8',
    });
    const decryptedKey = publicDecrypt(
      publicKey,
      Buffer.from(data.data1, 'base64'),
    ).toString();

    const decipher = createDecipheriv('aes-256-cbc', decryptedKey, iv);

    let decrypted = decipher.update(data.data2, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return {
      successful: true,
      error_code: null,
      data: {
        payload: decrypted,
      },
    };
  }
}

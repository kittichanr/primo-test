import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  DataDto,
  PayloadDto,
  ResponseDecryptDto,
  ResponseEncryptDto,
} from './dto';

@Controller('get-encrypt-data')
export class EncryptController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(200)
  async getEncrypt(@Body() payload: PayloadDto): Promise<ResponseEncryptDto> {
    return this.appService.getEncrypt(payload);
  }
}

@Controller('get-decrypt-data')
export class DecryptController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async getDecrypt(@Body() data: DataDto): Promise<ResponseDecryptDto> {
    return this.appService.getDecrypt(data);
  }
}

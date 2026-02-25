import { Module } from '@nestjs/common';
import { EncryptController, DecryptController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [EncryptController, DecryptController],
  providers: [AppService],
})
export class AppModule {}

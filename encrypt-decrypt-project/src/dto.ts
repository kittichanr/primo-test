import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PayloadDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  @ApiProperty()
  readonly payload: string;
}

export class DataDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly data1: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly data2: string;
}

export class ResponseEncryptDto {
  @ApiProperty()
  successful: boolean;

  @ApiProperty()
  error_code: string | null;

  @ApiProperty()
  data: null | {
    data1: string;
    data2: string;
  };
}

export class ResponseDecryptDto {
  @ApiProperty()
  successful: boolean;

  @ApiProperty()
  error_code: string | null;

  @ApiProperty()
  data: null | {
    payload: string;
  };
}

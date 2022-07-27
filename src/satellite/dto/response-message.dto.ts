import { Expose } from 'class-transformer';

export class ResponseMessageDto {
  @Expose()
  id: number;

  @Expose()
  payload: string;

  @Expose()
  status: string;

  @Expose()
  date: string;
}

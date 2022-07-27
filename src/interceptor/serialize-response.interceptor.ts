import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): object;
}

export class Serialize implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        const date = new Date(Date.now()).toLocaleTimeString(undefined, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        data.date = date;
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

export function SerializeResponse(dto: ClassConstructor) {
  return UseInterceptors(new Serialize(dto));
}

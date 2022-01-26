import { Pipe, PipeTransform, Type } from '@angular/core';
import { ISchedule } from '../interfaces/dto';

@Pipe({
  name: 'asType'
})
export class AsTypePipe implements PipeTransform {

  transform(value: unknown/* , type: Type<unknown> = undefined */): unknown {
    return value as ISchedule;
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inArray'
})
export class InArrayPipe implements PipeTransform {

  transform(collection: Array<unknown>, value: unknown): boolean {
    return collection.includes(value);
  }

}

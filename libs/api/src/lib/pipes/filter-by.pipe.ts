import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {

  transform(collection: Array<any>, prop: string, value: any): Array<any> {
    if (Array.isArray(value)){
      return collection.filter( item => value.includes(item[prop]));  
    }
    return collection.filter( item => item[prop] === value);
  }

}

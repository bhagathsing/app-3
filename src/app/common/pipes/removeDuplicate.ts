import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
  name: 'removeDuplicate'
})
export class RemoveDuplicatePipe implements PipeTransform {
  transform(value: any, field: string): any {
    if ( value === undefined || value === null || !field) {
      return value;
    }
    return _.uniqBy(value, field);
  }
}

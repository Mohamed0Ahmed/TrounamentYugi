import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcToLocal'
})
export class UtcToLocalPipe implements PipeTransform {
  transform(utcDate: string, hoursToAdd: number = 2): string {
    if (!utcDate) return '';

    let date = new Date(utcDate);
    date.setHours(date.getHours() + hoursToAdd);

    return date.toLocaleString();
  }
}

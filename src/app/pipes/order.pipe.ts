import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'order',
})
export class OrderPipe implements PipeTransform {
  transform(value: string[], order: 'asc' | 'desc' = 'asc'): string[] {
    return value.sort((a, b) => {
      if (a < b) {
        return order === 'asc' ? -1 : 1;
      }
      if (a > b) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}

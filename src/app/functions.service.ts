import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor() { }

  run(data: { test: string }): string {
    return data.test;
  }

  display(data: []): string {
    let ret = '';
    for (let i = 0; i < data.length; ++i) {
      ret += data[i] + " ; ";
    }
    return ret;
  }

  writeDate(data: { d: any, format: string }) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + parseInt(data.d));
    return formatDate(currentDate, data.format, 'en-US');
  }
}

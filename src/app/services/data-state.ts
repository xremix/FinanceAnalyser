import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { Category } from '../models/category';
@Injectable({
  providedIn: 'root',
})
export class DataState {
  public transactions: Transaction[] = [];
}

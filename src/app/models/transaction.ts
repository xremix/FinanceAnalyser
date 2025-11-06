import { Category } from "./category";

export interface Transaction {
  month: Date;
  bookingDate: Date;
  valueDate: Date;
  payerReceiver: string;
  bookingText: string;
  purpose: string;
  balance: number;
  balanceCurrency: string;
  amount: number;
  amountCurrency: string;
  category?: Category;
  raw: string;
  balancedByDescription?: string;
  balancedOfDescription?: string;
  source?: string; // Source file name for multiple file support
}
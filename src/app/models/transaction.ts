import { Category } from "./category";

export interface Transaction {
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
}
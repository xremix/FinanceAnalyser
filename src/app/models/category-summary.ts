import { Category } from "./category";
import { Transaction } from "./transaction";

export interface CategorySummary extends Category{
    value: number;
    transactions: Transaction[];
}
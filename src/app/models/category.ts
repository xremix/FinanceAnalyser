
import { Transaction } from "./transaction";

export interface Category{
    name: string;
    type: 'savings' | 'income' | 'expense';
    keywords: string[];
    excludeKeywords?: string[];
    subCategories: Category[];
    total: number;
    transactions: Transaction[];
    isDefault?: boolean;
    icon?: string;
}
export interface Category{
    category: string;
    mainCategory: string;
    type: 'savings' | 'income' | 'expense';
    keywords: string[];
}
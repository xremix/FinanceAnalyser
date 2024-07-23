
import { Transaction } from "./transaction";

export interface BaseCategory{
    name: string;
    type: 'savings' | 'income' | 'expense';
    keywords: string[];
    excludeKeywords?: string[];
    subCategories: BaseCategory[];
    isDefault?: boolean;
    icon?: string;
}

export interface Category extends BaseCategory{
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
export function mapCategoryToBaseCategory(category: Category): BaseCategory{
    var baseCategory: BaseCategory = {
        name: category.name,
        type: category.type,
        keywords: category.keywords,
        excludeKeywords: category.excludeKeywords,
        subCategories: category.subCategories.map(mapCategoryToBaseCategory),
        isDefault: category.isDefault,
        icon: category.icon
    }
    return baseCategory;
}

export function mapBaseCategoryToCategory(baseCategory: BaseCategory): Category{
    var category: Category = {
        name: baseCategory.name,
        type: baseCategory.type,
        keywords: baseCategory.keywords,
        excludeKeywords: baseCategory.excludeKeywords,
        subCategories: baseCategory.subCategories.map(mapBaseCategoryToCategory),
        total: 0,
        transactions: [],
        isDefault: baseCategory.isDefault,
        icon: baseCategory.icon
    }
    return category;
}
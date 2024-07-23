import { BaseCategory } from "./models/category";


export const defaultCategories: BaseCategory[] = [
    {
        name: 'Einkommen',
        icon: 'fa-solid fa-money-bill-trend-up',
        subCategories: [],
        type: 'income',
        keywords: [],
      },
    {
        name: 'Sonstiges',
        icon: 'fa-solid fa-rectangle-list',
        type: 'expense',
        keywords: [],
        subCategories: [
          {
            name: 'Sonstiges',
            subCategories: [],
            type: 'expense',
            keywords: [],
            isDefault: true,
          },
        ]
    }
]
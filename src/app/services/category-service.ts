import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { Category } from '../models/category';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  public defaultCategory: Category = {
    category: 'Sonstiges',
    mainCategory: 'Sonstiges',
    type: 'expense',
    keywords: [],
  };

  public categories: Category[] = [
    {
      category: 'Einkaufen',
      mainCategory: 'Einkaufen',
      type: 'expense',
      keywords: [
        'REWE',
        'HELLOFRESH',
        'MUELLER',
        'DROGERIE',
        'ROSSMANN',
        'ALDI',
        'LIDL',
        'MURR',
        'EDEKA',
        'BAECKER',
        'SCHMID BAECK',
        'WUENSCHE',
        'BACK',
        'GETRAENKE',
      ],
    },
    {
      category: 'Wohnung / Garten',
      mainCategory: 'Wohnung / Garten',
      type: 'expense',
      keywords: [
        'DEHNER',
        'MOEBEL',
        'ZWILLING',
        'SCHWARZMARKT',
        'MAISONS',
        'IKEA',
        'LEUCHTEN',
        'WOOLWORTH',
        'BAYWA',
        'XXXLUTZ',
        'SEEBAUER',
        'Amazon',
        'WERLES',
        'MOEMAX',
      ],
    },
    {
      category: 'Hasen',
      mainCategory: 'Hasen',
      type: 'expense',
      keywords: ['FRESSNAPF', 'Tierarzt'],
    },
    {
      category: 'Strom',

      mainCategory: 'Strom',
      type: 'expense',
      keywords: ['SWM'],
    },
    {
      category: 'Internet',
      mainCategory: 'Internet',
      type: 'expense',
      keywords: ['Vodafone'],
    },
    {
      category: 'Rundfunk',
      mainCategory: 'Rundfunk',
      type: 'expense',
      keywords: ['Rundfunk'],
    },
    {
      category: 'Essen / Kaffee',
      mainCategory: 'Essen / Kaffee',
      type: 'expense',
      keywords: [
        'PINOCCHIO',
        'Bellavista',
        'Essen',
        'CASTAGENO',
        'VIETNAME',
        'SUESSMUND',
        'GENUSSVOLL',
        'RATHAUSCAF',
        'GASTRONOMIE',
        'BURGER',
        'PIZZERIA',
        'Bella Vista',
        'KLOSTERMAIER',
        'WIRTSHAUS',
        'Floesserei',
        'TRATTORIA',
        'MCDONALDS',
        'Trottaria',
        'FORELLENHOF',
      ],
    },
    {
      category: 'Miete',
      mainCategory: 'Miete',
      type: 'expense',
      keywords: ['Stuelpnagel'],
    },
    {
      category: 'Einzahlungen',
      mainCategory: 'Einzahlungen',
      type: 'expense',
      keywords: ['Miete', 'Monatsgeld', 'Grundstock', 'Nebenkosten'],
    },
    {
      category: 'Apotheke',
      mainCategory: 'Apotheke',
      type: 'expense',
      keywords: ['APOTHEKE', 'Masken'],
    },
    {
      category: 'Freizeit / Urlaub',
      mainCategory: 'Freizeit / Urlaub',
      type: 'expense',
      keywords: [
        'PARKHAUS',
        'Urlaub',
        'MARKENSCHUH',
        'BOOKING.COM',
        'MOSCHETTIERI',
        'KARWENDEL',
        'Eibsee',
        'ROVINJ',
        'JESENICE',
        'PULA',
        ' HR ',
        'POREC',
        'EIBSEE',
        'RIESENRAD',
        'TIERPARK',
      ],
    },
  ];
  
  private categorizeTransaction(transaction: Transaction): Category {
    for (const category of this.categories) {
      if (
        category.keywords.some(
          (keyword) =>
            transaction.payerReceiver.toUpperCase().includes(keyword.toUpperCase()) ||
            transaction.bookingText.toUpperCase().includes(keyword.toUpperCase()) ||
            transaction.purpose.toUpperCase().includes(keyword.toUpperCase())
        )
      ) {
        return category;
      }
    }

    return this.defaultCategory;
  }

  public fillCategoriesToTransactions(transactions: Transaction[]): void {
    for (let transaction of transactions) {
        let category = this.categorizeTransaction(transaction);
        transaction.category = category;
        console.log(transaction.category.category);
      }
  }
}

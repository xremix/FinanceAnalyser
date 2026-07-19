import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { Transaction } from '../models/transaction';

export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

@Injectable({
  providedIn: 'root'
})
export class SankeyDataService {

  constructor() { }

  /**
   * Konvertiert gefilterte Transaktionen in Sankey-Chart-Daten.
   * Dadurch folgt das Sankey-Diagramm allen aktiven Filtern
   * (Zeitraum, Suche, Kategorie, Ein-/Ausgaben).
   */
  transformTransactionsToSankeyData(
    transactions: Transaction[],
    categories: Category[],
    type: 'expense' | 'income' = 'expense'
  ): SankeyData {
    const nodes: SankeyNode[] = [];
    const links: SankeyLink[] = [];
    const nodeSet = new Set<string>();

    const rootName = type === 'expense' ? 'Gesamtausgaben' : 'Gesamteinnahmen';
    const parentTotals = new Map<string, number>();
    const subTotals = new Map<string, number>();

    const matchesType = (transaction: Transaction): boolean => {
      if (type === 'expense') {
        return transaction.amount < 0;
      }
      return transaction.amount > 0;
    };

    const addToMap = (map: Map<string, number>, key: string, value: number): void => {
      map.set(key, (map.get(key) ?? 0) + value);
    };

    transactions
      .filter(matchesType)
      .forEach((transaction) => {
        const amount = Math.abs(transaction.amount);
        if (amount <= 0) {
          return;
        }

        if (!transaction.category) {
          addToMap(parentTotals, 'Unkategorisiert', amount);
          return;
        }

        const parentCategory = categories.find((category) =>
          category === transaction.category || category.subCategories?.some((subCategory) => subCategory === transaction.category)
        );

        const parentName = parentCategory?.name ?? transaction.category.name;
        addToMap(parentTotals, parentName, amount);

        const isSubCategory = !!parentCategory && parentCategory !== transaction.category;
        if (isSubCategory) {
          const subName = `${parentName} - ${transaction.category.name}`;
          addToMap(subTotals, subName, amount);
        }
      });

    if (parentTotals.size === 0) {
      return { nodes: [], links: [] };
    }

    nodes.push({ name: rootName });
    nodeSet.add(rootName);

    parentTotals.forEach((parentTotal, parentName) => {
      if (!nodeSet.has(parentName)) {
        nodes.push({ name: parentName });
        nodeSet.add(parentName);
      }

      links.push({
        source: rootName,
        target: parentName,
        value: parentTotal,
      });

      let subTotal = 0;
      subTotals.forEach((value, subName) => {
        if (!subName.startsWith(`${parentName} - `)) {
          return;
        }

        subTotal += value;
        if (!nodeSet.has(subName)) {
          nodes.push({ name: subName });
          nodeSet.add(subName);
        }

        links.push({
          source: parentName,
          target: subName,
          value,
        });
      });

      const remainingValue = parentTotal - subTotal;
      if (remainingValue > 1 && subTotal > 0) {
        const otherName = `${parentName} - Sonstige`;
        if (!nodeSet.has(otherName)) {
          nodes.push({ name: otherName });
          nodeSet.add(otherName);
        }

        links.push({
          source: parentName,
          target: otherName,
          value: remainingValue,
        });
      }
    });

    return { nodes, links };
  }

  /**
   * Konvertiert Kategorien in Sankey-Chart-Daten
   * Zeigt Gesamtausgaben → Hauptkategorien → Unterkategorien
   */
  transformCategoriesToSankeyData(categories: Category[], type: 'expense' | 'income' = 'expense'): SankeyData {
    const nodes: SankeyNode[] = [];
    const links: SankeyLink[] = [];
    const nodeSet = new Set<string>();

    // Filtere nach Typ und nur Kategorien mit Werten
    const filteredCategories = categories.filter(
      cat => cat.type === type && Math.abs(cat.total) > 0
    );

    if (filteredCategories.length === 0) {
      return { nodes: [], links: [] };
    }

    // Root-Node (Gesamtausgaben oder Gesamteinnahmen)
    const rootName = type === 'expense' ? 'Gesamtausgaben' : 'Gesamteinnahmen';
    nodes.push({ name: rootName });
    nodeSet.add(rootName);

    // Berechne Gesamtsumme
    const total = filteredCategories.reduce((sum, cat) => sum + Math.abs(cat.total), 0);

    filteredCategories.forEach(category => {
      const categoryValue = Math.abs(category.total);
      
      if (categoryValue <= 0) return;

      // Hauptkategorie hinzufügen
      if (!nodeSet.has(category.name)) {
        nodes.push({ name: category.name });
        nodeSet.add(category.name);
      }

      // Hat die Kategorie Unterkategorien mit Werten?
      const subCategoriesWithValues = category.subCategories?.filter(
        sub => Math.abs(sub.total) > 0
      ) || [];

      if (subCategoriesWithValues.length > 0) {
        // Link von Root zur Hauptkategorie
        links.push({
          source: rootName,
          target: category.name,
          value: categoryValue
        });

        // Unterkategorien verarbeiten
        subCategoriesWithValues.forEach(subCategory => {
          const subValue = Math.abs(subCategory.total);
          const subName = `${category.name} - ${subCategory.name}`;

          if (!nodeSet.has(subName)) {
            nodes.push({ name: subName });
            nodeSet.add(subName);
          }

          // Link von Hauptkategorie zur Unterkategorie
          links.push({
            source: category.name,
            target: subName,
            value: subValue
          });
        });

        // "Sonstige" für nicht zugeordnete Beträge in der Hauptkategorie
        const subTotal = subCategoriesWithValues.reduce((sum, sub) => sum + Math.abs(sub.total), 0);
        const remainingValue = categoryValue - subTotal;
        
        if (remainingValue > 1) { // Mindestens 1€ für "Sonstige"
          const otherName = `${category.name} - Sonstige`;
          if (!nodeSet.has(otherName)) {
            nodes.push({ name: otherName });
            nodeSet.add(otherName);
          }
          links.push({
            source: category.name,
            target: otherName,
            value: remainingValue
          });
        }
      } else {
        // Keine Unterkategorien - direkter Link von Root
        links.push({
          source: rootName,
          target: category.name,
          value: categoryValue
        });
      }
    });

    return { nodes, links };
  }

  /**
   * Formatiert einen Betrag als Euro-Währung
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  }
}

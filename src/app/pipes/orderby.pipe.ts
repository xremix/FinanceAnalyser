import { Pipe, PipeTransform } from "@angular/core";
import { CategorySummary } from "../models/category-summary";


@Pipe({
    name: "orderBy",
  })
  export class OrderByPipe implements PipeTransform {
    transform<T>(value: T[], property: keyof T, order: "asc" | "desc" = "asc"): T[] {
        return value.sort((a, b) => {
            if (a[property] < b[property]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[property] > b[property]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    }
  }
  @Pipe({
    name: "orderByCategorySummary",
  })
  export class OrderByCategorySummary implements PipeTransform {
    transform(value: CategorySummary[], property: keyof CategorySummary, order: "asc" | "desc" = "asc"): CategorySummary[] {
        return value.sort((a, b) => {
            if (a[property] < b[property]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[property] > b[property]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    }
  }
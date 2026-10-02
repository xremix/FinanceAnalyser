export interface BalanceAnchor {
  /** Balance at the end of this day */
  date: Date;
  amount: number;
  source: 'file' | 'manual';
  sourceName?: string;
}

export interface DailyBalance {
  date: Date;
  /** Balance at the end of the day */
  balance: number;
  /** Sum of all bookings on this day */
  change: number;
}

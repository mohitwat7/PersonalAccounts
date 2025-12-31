
export type TransactionType = 'INCOME' | 'EXPENSE';
export type PaymentMode = 'CASH' | 'UPI' | 'NONE';

export interface Transaction {
  id: string;
  date: string; // ISO format YYYY-MM-DD
  type: TransactionType;
  amount: number;
  particulars: string;
  mode: PaymentMode;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
}

import { AvailableLocale } from '@i18n/index';

export type BudgetValues = number[];

export const availableCurrencies = [
  'USD',
  'EUR',
  'JPY',
  'GBP',
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'CZK',
  'SEK',
  'NZD',
  'MXN',
  'SGD',
  'HKD',
  'NOK',
  'KRW',
  'TRY',
  'INR',
  'RUB',
  'BRL',
  'ZAR'
];

export type AvailableCurrency =
  | 'USD'
  | 'EUR'
  | 'JPY'
  | 'GBP'
  | 'AUD'
  | 'CAD'
  | 'CHF'
  | 'CNY'
  | 'CZK'
  | 'SEK'
  | 'NZD'
  | 'MXN'
  | 'SGD'
  | 'HKD'
  | 'NOK'
  | 'KRW'
  | 'TRY'
  | 'INR'
  | 'RUB'
  | 'BRL'
  | 'ZAR';

export interface Budget {
  id: string;
  name: string;
  values: BudgetValues;
}

export interface BudgetGroup {
  id: string;
  name: string;
  budgets: Budget[];
}

export interface BudgetYear {
  year: number;
  expenses: BudgetGroup[];
  income: BudgetGroup[];
}

export type DataState = {
  id: string;
  // TODO: Make this paginated.
  years: BudgetYear[];
  locale: AvailableLocale;
  currency: AvailableCurrency;
};

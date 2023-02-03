// -------
// Expense
// -------

export interface Category {
  id?: string;
  name: string;
}

export interface Expense {
  // read-only
  id?: string;
  createdAt?: Date;
  lastModifiedAt?: Date;
  // editable
  amount: number;
  category: Category;
  date: Date;
  name: string;
}

export interface PagingCriteria {
  page: number;
  size: number;
  sort: string;
}

export interface Page<T> {
  content: T[];
  last: boolean;
  totalElements: number;
}

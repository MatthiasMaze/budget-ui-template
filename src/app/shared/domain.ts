// -------
// Expense
// -------

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

export interface Category {
  id?: string;
  name: string;
}

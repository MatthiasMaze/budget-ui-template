import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Expense, ExpenseCriteria, ExpenseUpsertDto, Page } from '../shared/domain';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly apiUrl = `${environment.backendUrl}/expenses`;

  constructor(private readonly httpClient: HttpClient) {}

  // Read

  getExpenses = (expenseCriteria: ExpenseCriteria): Observable<Page<Expense>> =>
    this.httpClient.get<Page<Expense>>(this.apiUrl, {
      params: new HttpParams({
        fromObject: { ...expenseCriteria },
      }),
    });

  // Create & Update

  upsertExpense = (expense: ExpenseUpsertDto): Observable<void> => this.httpClient.put<void>(this.apiUrl, expense);

  // Delete

  deleteExpense = (id: string): Observable<void> => this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
}

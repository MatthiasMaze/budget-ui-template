import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Page, PagingCriteria } from '../shared/domain';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = `${environment.backendUrl}/categories`;

  constructor(private readonly httpClient: HttpClient) {}

  // Read

  getCategories = (pagingCriteria: PagingCriteria): Observable<Page<Category>> =>
    this.httpClient.get<Page<Category>>(this.apiUrl, {
      params: new HttpParams({
        fromObject: { ...pagingCriteria },
      }),
    });

  // Create & Update

  upsertCategory = (category: Category): Observable<void> => this.httpClient.put<void>(this.apiUrl, category);

  // Delete

  deleteCategory = (id: string): Observable<void> => this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
}

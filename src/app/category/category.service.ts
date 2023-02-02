import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Category, Page, PagingCriteria} from '../shared/domain';
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = `${environment.backendUrl}/categories`;

  constructor(private readonly httpClient: HttpClient) {}

  getCategories = (pagingCriteria: PagingCriteria): Observable<Page<Category>> =>
    this.httpClient.get<Page<Category>>(this.apiUrl, {
      headers: new HttpHeaders({
        page: pagingCriteria?.pageNumber?.toString(),
        size: pagingCriteria?.pageSize?.toString(),
        sort: `${pagingCriteria?.sortColumn},${pagingCriteria?.sortDirection}`,
      }),
    });
}

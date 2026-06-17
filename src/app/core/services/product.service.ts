import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponse } from '../../shared/models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = 'https://dummyjson.com/products';

  getProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.baseUrl);
  }

  searchProducts(keyword: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/search`, {
      params: { q: keyword }
    });
  }
}

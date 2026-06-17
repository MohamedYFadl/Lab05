import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/models/product.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.css'
})
export class SearchProductsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private toastr = inject(ToastrService);

  searchForm!: FormGroup;
  products: Product[] = [];
  isLoading = signal(false);
  hasSearched = signal(false);
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      query: ['', [Validators.required]]
    });
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.isLoading.set(true);
      this.hasSearched.set(true);
      const { query } = this.searchForm.value;

      this.productService.searchProducts(query).subscribe({
        next: (response) => {
          this.products = response.products;
          this.isLoading.set(false);
          if (this.products.length === 0) {
            this.toastr.warning(`No products found for "${query}"`, 'No Results');
          } else {
            this.toastr.success(`Found ${this.products.length} products matching "${query}"`, 'Search Success');
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.toastr.error('Search request failed.', 'Search Error');
          console.error(err);
        }
      });
    } else {
      this.toastr.warning('Please enter a search query.', 'Empty Input');
    }
  }
}

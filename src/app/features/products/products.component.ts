import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/models/product.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private toastr = inject(ToastrService);

  products: Product[] = [];
  isLoading = signal(true);

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (response) => {
        console.log(response.products);
        this.products = response.products;
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastr.error('Failed to load products from API.', 'API Error');
        console.error(err);
      }
    });
  }
}

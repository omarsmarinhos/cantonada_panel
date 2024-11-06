import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../shared/models/Product.model';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    UpperCasePipe,
    MatIconModule,
    CurrencyPipe
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  @Input({ required: true }) product!: Product;
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<number>();

  onEdit() {
    this.edit.emit(this.product);
  }

  onDelete() {
    this.delete.emit(this.product.iIdProducto);
  }
}

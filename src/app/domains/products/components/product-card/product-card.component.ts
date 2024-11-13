import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../shared/models/Product.model';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    UpperCasePipe,
    MatIconModule,
    CurrencyPipe,
    MatTooltipModule
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  @Input({ required: true }) product!: Product;
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<number>();
  @Output() addAdditional = new EventEmitter<Product>();

  onEdit() {
    this.edit.emit(this.product);
  }

  onDelete() {
    this.delete.emit(this.product.iIdProducto);
  }
  
  onAddAdditional() {
    this.addAdditional.emit(this.product);
  }
}

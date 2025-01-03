import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../shared/models/Category.model';
import { MatIconModule } from '@angular/material/icon';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [
    MatIconModule,
    UpperCasePipe
  ],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss'
})
export class CategoryCardComponent {

  @Input({ required: true }) category!: Category;
  @Output() edit = new EventEmitter<Category>();
  @Output() delete = new EventEmitter<number>();

  onEdit() {
    this.edit.emit(this.category);
  }

  onDelete() {
    this.delete.emit(this.category.iIdCategoria);
  }

}

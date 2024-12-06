import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() totalItems: number = 1477;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 12;
  @Output() pageChange = new EventEmitter<number>();
  totalPages: number = 0;
  pageNumbers: number[] = [];

  ngOnInit() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updatePageNumbers();
  }

  ngOnChanges() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updatePageNumbers();
  }

  updatePageNumbers() {
    const pagesToShow = 3;
    const startPage = Math.max(1, this.currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + pagesToShow - 1);

    this.pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      this.pageNumbers.push(i);
    }
  }

  goToPage(page: number) {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage); // Emitir la página actual
      this.updatePageNumbers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage); // Emitir la página actual
      this.updatePageNumbers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage); // Emitir la página actual
      this.updatePageNumbers();
    }
  }
}

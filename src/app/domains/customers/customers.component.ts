import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlertService } from '../shared/services/alert.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { CustomerService } from '../shared/services/customer.service';
import { Customer } from '../shared/models/Customer.model';
import { CapitalizePipe } from '../shared/pipes/capitalize.pipe';
import { PaginationComponent } from "./components/pagination/pagination.component";
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CapitalizePipe,
    PaginationComponent,
    MatInputModule
],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export default class CustomersComponent {

  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly customerService = inject(CustomerService)

  customers = signal<Customer[]>([]);
  dataSourceCustomers = signal<MatTableDataSource<Customer>>(
    new MatTableDataSource<Customer>()
  );
  displayedColumns: string[] = ['tNombre', 'tApellido', 'tTelefono', 'tEmail', 'fFechaRegistro', 'fUltimoAcceso', 'tEstado'];

  totalItems = signal(0);
  selectedState: string = '';
  searchQuery: string = '';
  currentPage: number = 1;

  constructor() {
    effect(() => {
      this.dataSourceCustomers().data = this.customers();
    });
  }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers({
      iPageNumber: 1,
      iPageSize: 15,
      tEstado: this.selectedState,
      tSearch: this.searchQuery,
    }).subscribe({
      next: (res) => {
        this.customers.set(res.data);
        this.totalItems.set(res.totalRecords);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadCustomers();
  }

  onStateChange() {
    this.searchQuery = '';
    this.loadCustomers();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadCustomers();
  }
}

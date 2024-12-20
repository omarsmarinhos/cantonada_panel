import { Component, effect, inject, signal } from '@angular/core';
import { PaginationComponent } from "../customers/components/pagination/pagination.component";
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { UserService } from '../shared/services/user.service';
import { UserResponse } from '../shared/models/user-response.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Branch } from '../shared/models/Branch.model';
import { BranchService } from '../shared/services/branch.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe } from '../shared/pipes/capitalize.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { AlertService } from '../shared/services/alert.service';
import { UserAddModalComponent } from './components/user-add-modal/user-add-modal.component';
import { UserEditModalComponent } from './components/user-edit-modal/user-edit-modal.component';
import { Role } from '../shared/models/role.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    PaginationComponent,
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CapitalizePipe,
    MatInputModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export default class UsersComponent {

  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly userService = inject(UserService);
  private readonly branchService = inject(BranchService);
  private readonly dialog = inject(MatDialog);

  users = signal<UserResponse[]>([]);
  dataSourceUsers = signal<MatTableDataSource<UserResponse>>(
    new MatTableDataSource<UserResponse>()
  );
  displayedColumns: string[] = ['tNombre', 'tUsername', 'tRol', 'tSucursal', 'lAcceso', 'actions'];

  totalItems = signal(0);
  selectedBranch: number = 0;
  selectedSort: string = '';
  searchQuery: string = '';
  currentPage: number = 1;

  branches = signal<Branch[]>([]);
  roles = signal<Role[]>([]);

  constructor() {
    effect(() => {
      this.dataSourceUsers().data = this.users();
    });
  }

  ngOnInit() {
    this.loadBranches();
    this.loadRoles();
    this.loadUsers();
  }

  loadBranches() {
    this.branchService.getSucursal().subscribe({
      next: (res) => {
        this.branches.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  loadRoles() {
    this.userService.getRoles().subscribe({
      next: (res) => {
        this.roles.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  loadUsers() {
    this.userService.getUsers({
      iPageNumber: 1,
      iPageSize: 15,
      iIdSucursal: this.selectedBranch,
      tSearch: this.searchQuery,
      tSort: this.selectedSort
    }).subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.totalItems.set(res.totalRecords);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  onAdd() {
    const dialogRef = this.dialog.open(UserAddModalComponent, {
      width: '1100px',
      data: {
        branches: this.branches(),
        roles: this.roles(),
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadUsers();
      }
    })
  }

  onEdit(user: UserResponse) {
    const dialogRef = this.dialog.open(UserEditModalComponent, {
      width: '1100px',
      data: {
        branches: this.branches(),
        roles: this.roles(),
        user: user
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadUsers();
      }
    })
  }

  onToggleAccess(user: UserResponse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: user.lAcceso ? 'Confirmar desactivación de acceso' : 'Confirmar activación de acceso',
        desc: user.lAcceso
          ? `¿Estás seguro de que deseas desactivar el acceso del usuario ${user.tNombre} (${user.tUsername})?`
          : `¿Estás seguro de que deseas activar el acceso del usuario ${user.tNombre} (${user.tUsername})?`,
        action: user.lAcceso ? 'Desactivar acceso' : 'Activar acceso'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.toggleAccess(user).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadUsers();
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        })
      }
    });
  }

  onDelete(iIdUser: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.delete(iIdUser).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadUsers();
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        })
      }
    });
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadUsers();
  }

  onBranchChange() {
    this.loadUsers();
  }

  onSortChange() {
    this.loadUsers();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadUsers();
  }
}

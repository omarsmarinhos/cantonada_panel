import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BranchService } from '../shared/services/branch.service';
import { Branch } from '../shared/models/Branch.model';
import { BranchCardComponent } from "./components/branch-card/branch-card.component";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { AlertService } from '../shared/services/alert.service';
import { BranchEditModalComponent } from './components/branch-edit-modal/branch-edit-modal.component';
import { BranchAddModalComponent } from './components/branch-add-modal/branch-add-modal.component';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    BranchCardComponent,
    CdkDropList,
    CdkDrag,
    MatProgressBarModule
  ],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss'
})
export default class BranchesComponent {

  private readonly branchService = inject(BranchService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  readonly authService = inject(AuthService);

  currentBranchUser = this.authService.getIdSucursal();

  branches = signal<Branch[]>([]);
  isSorting: boolean = false;
  isLoadingToggle: boolean = false;
  idBranchLoading: number = 0;

  ngOnInit() {
    this.loadBranches();
  }

  loadBranches() {
    this.branchService.getSucursal().subscribe({
      next: (res) => {
        this.branches.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    })
  }

  onAddBranch() {
    if (this.isSorting) {
      this.alertService.showWarning("No puede realizar esta acción mientras ordena.")
      return;
    }

    const dialogRef = this.dialog.open(BranchAddModalComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.branchService.addBranch(result).subscribe({
          next: (res) => {
            this.alertService.showSuccess("Sucursal agregada");
            this.loadBranches();
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        })
      }
    });
  }

  onEditBranch(branch: Branch) {
    if (this.isSorting) {
      this.alertService.showWarning("No puede realizar esta acción mientras ordena.")
      return;
    }

    const dialogRef = this.dialog.open(BranchEditModalComponent, {
      width: '900px',
      data: branch
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.branchService.editBranch(result).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadBranches();
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        })
      }
    });
  }

  onDeleteBranch(iIdSucursal: number) {
    if (this.isSorting) {
      this.alertService.showWarning("No puede realizar esta acción mientras ordena.")
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.branchService.deleteBranch(iIdSucursal).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadBranches();
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        })
      }
    });
  }

  onToggleStore(branch: Branch) {
    if (this.isSorting) {
      this.alertService.showWarning("No puede realizar esta acción mientras ordena.")
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: branch.lAbierto ? 'Confirmar cierre de tienda' : 'Confirmar apertura de tienda',
        desc: branch.lAbierto ? '¿Estás seguro de que deseas cerrar esta tienda?' : '¿Estás seguro de que deseas abrir esta tienda?',
        action: branch.lAbierto ? 'Cerrar' : 'Abrir'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoadingToggle = true;
        this.idBranchLoading = branch.iIdSucursal;
        this.branchService.toggleStore(branch).subscribe({
          next: (res) => {
            this.isLoadingToggle = false;
            this.idBranchLoading = 0;
            this.alertService.showSuccess(res.mensaje);
            this.loadBranches();
          },
          error: (err) => {
            this.isLoadingToggle = false;
            this.idBranchLoading = 0;
            this.errorService.showError(err);
          }
        })
      }
    });
  }

  onSortingBranches() {
    const sortedBranches = this.branches().map((branch, index) => ({
      iId: branch.iIdSucursal,
      nOrden: index
    }));

    this.branchService.sortBranch(sortedBranches).subscribe({
      next: (res) => {
        this.alertService.showSuccess(res.mensaje);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  drop(event: CdkDragDrop<Branch[]>) {
    moveItemInArray(this.branches(), event.previousIndex, event.currentIndex);
    this.branches.set([...this.branches()]);
  }

  toggleSorting() {
    if (this.isSorting) {
      this.onSortingBranches();
    }
    this.isSorting = !this.isSorting;
  }

  cancelSorting() {
    this.isSorting = false;
    this.loadBranches();
  }
}

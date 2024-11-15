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

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    BranchCardComponent,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss'
})
export default class BranchesComponent {

  readonly branchService = inject(BranchService);
  readonly dialog = inject(MatDialog);
  readonly alertService = inject(AlertService);

  branches = signal<Branch[]>([]);
  isSorting: boolean = false;

  ngOnInit() {
    this.loadBranches();
  }

  loadBranches() {
    this.branchService.getSucursal().subscribe({
      next: (res) => {
        this.branches.set(res);
      },
      error: (err) => {
        console.error(err);
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
            console.log(err);
            if (err.error.detalles) {
              this.alertService.showWarning(err.error.detalles);
            } else {
              this.alertService.showError("Ocurrió un error");
              console.error(err);
            }
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
            console.log(err);
            if (err.error.detalles) {
              this.alertService.showWarning(err.error.detalles);
            } else {
              this.alertService.showError("Ocurrió un error");
              console.error(err);
            }
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
        console.log(err);
        if (err.error.detalles) {
          this.alertService.showWarning(err.error.detalles);
        } else {
          this.alertService.showError("Ocurrió un error");
          console.error(err);
        }
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

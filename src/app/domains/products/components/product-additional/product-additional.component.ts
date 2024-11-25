import { Component, inject } from '@angular/core';
import { Product } from '../../../shared/models/Product.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { ProductAdditionalService } from '../../../shared/services/additional.service';
import { ProductAdditional } from '../../../shared/models/ProductAdditional.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-product-additional',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    CdkDropList,
    CdkDrag,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './product-additional.component.html',
  styleUrl: './product-additional.component.scss'
})
export class ProductAdditionalComponent {

  private readonly dialogRef = inject(MatDialogRef<ProductAdditionalComponent>);
  readonly product = inject<Product>(MAT_DIALOG_DATA);
  private readonly additionalService = inject(ProductAdditionalService);
  private readonly alertService = inject(AlertService);

  notAssignedAdditional: ProductAdditional[] = [];
  assignedAdditional: ProductAdditional[] = [];

  constructor() { }

  ngOnInit() {
    this.loadAdditional();
  }

  loadAdditional() {
    this.additionalService.getAdditional(this.product.iIdProducto).subscribe({
      next: (res) => {
        this.notAssignedAdditional = res.noAsignados || [];
        this.assignedAdditional = res.asignados || [];
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.product.iAdicionalesGratis > 0) {
      const hasFreeAdditional = this.assignedAdditional.some(additional => additional.lGratis === true);
    
    if (!hasFreeAdditional) {
      this.alertService.showWarning("Debe marcar por lo menos un adicional como gratis.");
      return;
    }
      
    }
    this.dialogRef.close({
      iIdProducto: this.product.iIdProducto,
      jAdicionales: this.assignedAdditional.map(element => {
        return {
          iIdProductoAdicional: element.iIdProductoAdicional,
          lObligatorio: element.lObligatorio,
          lGratis: element.lGratis
        };
      })
    });
  }

  drop(event: CdkDragDrop<ProductAdditional[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedItem = event.previousContainer.data[event.previousIndex];

      movedItem.lObligatorio = false;
      movedItem.lGratis = false;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  addToAssigned(item: ProductAdditional): void {
    const index = this.notAssignedAdditional.indexOf(item);
    if (index !== -1) {
      this.notAssignedAdditional.splice(index, 1);
      this.assignedAdditional.push({ ...item, lObligatorio: false, lGratis: false });
    }
  }

  removeFromAssigned(item: ProductAdditional): void {
    const index = this.assignedAdditional.indexOf(item);
    if (index !== -1) {
      this.assignedAdditional.splice(index, 1);
      this.notAssignedAdditional.push(item);
    }
  }

  isAdditionalFreeAllowed(item: ProductAdditional): boolean {
    return this.product.iAdicionalesGratis > 0;
  }
}

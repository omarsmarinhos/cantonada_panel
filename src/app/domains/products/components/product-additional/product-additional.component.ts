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

  readonly dialogRef = inject(MatDialogRef<ProductAdditionalComponent>);
  readonly product = inject<Product>(MAT_DIALOG_DATA);
  readonly additionalService = inject(ProductAdditionalService);

  notAssignedAdditional: ProductAdditional[] = [];
  assignedAdditional: ProductAdditional[] = [];

  constructor() {

  }

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
    this.dialogRef.close({
      iIdProducto: this.product.iIdProducto,
      jAdicionales: this.assignedAdditional.map(element => {
        return {
          iIdProductoAdicional: element.iIdProductoAdicional,
          lObligatorio: element.lObligatorio
        };
      })
    });
  }

  drop(event: CdkDragDrop<ProductAdditional[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedItem = event.previousContainer.data[event.previousIndex];
      if (movedItem.lObligatorio === null || movedItem.lObligatorio === undefined) {
        movedItem.lObligatorio = false;
      }

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
      this.assignedAdditional.push({ ...item, lObligatorio: false });
    }
  }
  
  removeFromAssigned(item: ProductAdditional): void {
    const index = this.assignedAdditional.indexOf(item);
    if (index !== -1) {
      this.assignedAdditional.splice(index, 1);
      this.notAssignedAdditional.push(item);
    }
  }
}

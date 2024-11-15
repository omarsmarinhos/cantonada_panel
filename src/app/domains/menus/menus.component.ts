import { Component, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MenuService } from '../shared/services/menu.service';
import { MatDialog } from '@angular/material/dialog';
import { Menu } from '../shared/models/Menu.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlertService } from '../shared/services/alert.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { MenuAddModalComponent } from './components/menu-add-modal/menu-add-modal.component';
import { MenuEditModalComponent } from './components/menu-edit-modal/menu-edit-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss'
})
export default class MenusComponent {

  readonly menuService = inject(MenuService);
  readonly dialog = inject(MatDialog);
  readonly alertService = inject(AlertService);

  menus = signal<Menu[]>([]);
  dataSourceMenus = signal<MatTableDataSource<Menu>>(
    new MatTableDataSource<Menu>()
  );
  displayedColumns: string[] = ['tNombre', 'tEnlace', 'tFragmento', 'lFragmentoRepetido', 'lVisible', 'actions'];
  isSorting = false;

  constructor() {
    effect(() => {
      this.dataSourceMenus().data = this.menus();
    });
  }

  ngOnInit() {
    this.loadMenus();
  }

  loadMenus() {
    this.menuService.getMenus().subscribe({
      next: (res) => {
        this.menus.set(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onAddMenu() {
    if (this.isSorting) {
      return;
    }

    const dialogRef = this.dialog.open(MenuAddModalComponent, {
      width: '900px'
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.menuService.addMenu(result).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadMenus();
          },
          error: (err) => {
            console.error(err);
            if (err.error.detalles) {
              this.alertService.showWarning(err.error.detalles);
            } else {
              this.alertService.showError("Ocurrió un error");
            }
          }
        });
      }
    });
  }

  onEditMenu(menu: Menu) {
    if (this.isSorting) {
      return;
    }

    const dialogRef = this.dialog.open(MenuEditModalComponent, {
      width: '900px',
      data: menu
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.menuService.editMenu(result).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadMenus();
          },
          error: (err) => {
            console.error(err);
            if (err.error.detalles) {
              this.alertService.showWarning(err.error.detalles);
            } else {
              this.alertService.showError("Ocurrió un error");
            }
          }
        });
      }
    });
  }

  onDeleteMenu(iIdMenu: number) {
    if (this.isSorting) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.menuService.deleteMenu(iIdMenu).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadMenus();
          }
        })
      }
    });
  }

  onSortingMenu() {
    const sortedMenus = this.menus().map((menu, index) => ({
      iId: menu.iIdMenu,
      nOrden: index
    }));

    this.menuService.sortMenu(sortedMenus).subscribe({
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

  toggleSorting() {
    if (this.isSorting) {
      this.onSortingMenu();
    }
    this.isSorting = !this.isSorting;
    this.changeDisplayedColumns();
  }

  cancelSorting() {
    this.isSorting = false;
    this.changeDisplayedColumns();
    this.loadMenus();
  }

  changeDisplayedColumns() {
    if (this.isSorting) {
      this.displayedColumns = [...this.displayedColumns, 'sorting'];
    } else {
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'sorting');
    }
  }

  moveUp(index: number) {
    if (index > 0) {
      const menus = [...this.menus()]; // Crea una nueva referencia
      [menus[index - 1], menus[index]] = [menus[index], menus[index - 1]];
      this.menus.set(menus); // Actualiza la señal
    }
  }

  moveDown(index: number) {
    if (index < this.menus().length - 1) {
      const menus = [...this.menus()]; // Crea una nueva referencia
      [menus[index + 1], menus[index]] = [menus[index], menus[index + 1]];
      this.menus.set(menus); // Actualiza la señal
    }
  }

}

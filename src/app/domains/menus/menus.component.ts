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

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule
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
}

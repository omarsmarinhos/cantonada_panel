import { Component, computed, effect, inject, Input, signal } from '@angular/core';
import { ZoneService } from '../shared/services/zone.service';
import { Zone } from '../shared/models/Zone.model';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BranchService } from '../shared/services/branch.service';
import { Branch } from '../shared/models/Branch.model';
import { CapitalizePipe } from '../shared/pipes/capitalize.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { AlertService } from '../shared/services/alert.service';
import { ZoneAddModalComponent } from './components/zone-add-modal/zone-add-modal.component';
import { ZoneEditModalComponent } from './components/zone-edit-modal/zone-edit-modal.component';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-zones',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CapitalizePipe
  ],
  templateUrl: './zones.component.html',
  styleUrl: './zones.component.scss'
})
export default class ZonesComponent {

  @Input() id?: string;

  private readonly router = inject(Router);
  private readonly zoneService = inject(ZoneService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly branchService = inject(BranchService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService);

  isSynchronizedWithFast = this.authService.isSynchronizedWithFast();

  zones = signal<Zone[]>([]);
  polygons = computed(() =>
    this.zones().map(zone =>
      JSON.parse(zone.jPoligono)
    )
  );
  branch: Branch | undefined;
  dataSourceZones = signal<MatTableDataSource<Zone>>(
    new MatTableDataSource<Zone>()
  );
  displayedColumns: string[] = ['tNombre', 'dPrecio', 'actions'];

  constructor() {
    effect(() => {
      this.dataSourceZones().data = this.zones();
    });
    if (this.isSynchronizedWithFast) {
      this.displayedColumns.splice(1, 0, 'iIdZonaFast');
    }
  }

  ngOnInit() {
    if (this.id) {
      this.loadZones();
      this.loadBranch(parseInt(this.id));
    }
  }

  loadZones() {
    this.zoneService.getZones(parseInt(this.id!)).subscribe({
      next: (res) => {
        this.zones.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
        this.goToBranchesDomain();
      }
    });
  }

  loadBranch(id: number) {
    this.branchService.getSucursalById(id).subscribe({
      next: (res) => {
        this.branch = res;
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  goToBranchesDomain() {
    this.router.navigate(["/sucursales"]);
  }

  onAddZone() {
    const dialogRef = this.dialog.open(ZoneAddModalComponent, {
      width: '900px',
      data: { branch: this.branch, polygons: this.polygons() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.zoneService.addZone(result).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadZones();
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        });
      }
    });
  }

  onEditZone(zone: Zone) {
    const allPolygonsExceptCurrent = this.polygons().filter((_, index) => 
      this.zones()[index].iIdZona !== zone.iIdZona
    );

    const dialogRef = this.dialog.open(ZoneEditModalComponent, {
      width: '900px',
      data: { zone: zone, polygons: allPolygonsExceptCurrent, branch: this.branch }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.zoneService.editZone(result).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadZones();
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        });
      }
    });
  }

  onDeleteZone(iIdZone: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.zoneService.deleteZone(iIdZone).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadZones();
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        })
      }
    });
  }
}

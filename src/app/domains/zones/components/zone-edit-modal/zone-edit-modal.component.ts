import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlertService } from '../../../shared/services/alert.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { GoogleMap, MapAdvancedMarker, MapPolygon } from '@angular/google-maps';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-zone-edit-modal',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    GoogleMap,
    MapAdvancedMarker,
    MapPolygon
  ],
  templateUrl: './zone-edit-modal.component.html',
  styleUrl: './zone-edit-modal.component.scss'
})
export class ZoneEditModalComponent {

  @ViewChild(GoogleMap) map!: GoogleMap;

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<this>);
  private readonly alertService = inject(AlertService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription: Subscription | undefined;
  private readonly data = inject<any>(MAT_DIALOG_DATA);
  private readonly authService = inject(AuthService);

  isSynchronizedWithFast = this.authService.isSynchronizedWithFast();

  form: FormGroup;
  colspan3 = 12;

  center = signal<google.maps.LatLngLiteral>({ lat: -9.122203154836235, lng: -78.52960958851075 });
  mapOptions: google.maps.MapOptions = { streetViewControl: false, mapTypeControl: false };
  markerOptions: google.maps.marker.AdvancedMarkerElementOptions = { gmpDraggable: false };


  drawingManager?: google.maps.drawing.DrawingManager;
  polygon?: google.maps.Polygon;
  tempPolygonCoords: google.maps.LatLng[] = [];
  finalPolygonCoords: google.maps.LatLng[] = [];
  isPolygonDrawn = false;
  showDrawPolygonButton = false;
  isEditable = true;

  polygons: google.maps.LatLngLiteral[][] = [];
  originalZonePolygon: google.maps.LatLngLiteral[] = [];

  constructor() {
    this.form = this.fb.group({
      tNombre: [this.data.zone.tNombre, [Validators.required, Validators.pattern(/\S+/)]],
      dPrecio: [this.data.zone.dPrecio, [
        Validators.required,
        Validators.min(0),
        Validators.max(9999.99),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      jPoligono: [this.data.zone.jPoligono, []],
      iIdZona: [this.data.zone.iIdZona],
      iIdZonaFast: [{value: this.data.zone.iIdZonaFast, disabled: !this.isSynchronizedWithFast}, [
        Validators.required,
        Validators.min(0),
      ]]
    });
    this.originalZonePolygon = JSON.parse(this.data.zone.jPoligono);
    this.polygons = this.data.polygons;
    this.center.set(JSON.parse(this.data.branch.jLatLng));
  }

  ngOnInit() {
    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      this.colspan3 = state.matches ? 4 : 12;
    });
  }

  ngAfterViewInit() {
    this.initExistingPolygon();
    this.initDrawingManager();
  }

  initExistingPolygon() {
    if (this.originalZonePolygon.length) {
      this.polygon = new google.maps.Polygon({
        paths: this.originalZonePolygon,
        fillColor: '#ffff00',
        fillOpacity: 0.5,
        strokeWeight: 2,
        editable: true,
        draggable: true
      });
      this.polygon.setMap(this.map.googleMap!);

      // Listeners para actualizar coordenadas al editar
      google.maps.event.addListener(this.polygon.getPath(), 'set_at', () => {
        this.tempPolygonCoords = this.polygon!.getPath().getArray();
      });

      google.maps.event.addListener(this.polygon.getPath(), 'insert_at', () => {
        this.tempPolygonCoords = this.polygon!.getPath().getArray();
      });

      this.isPolygonDrawn = true;
      this.showDrawPolygonButton = false;
    }
  }

  initDrawingManager() {
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      polygonOptions: {
        fillColor: '#ffff00',
        fillOpacity: 0.5,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1
      }
    });

    this.drawingManager.setMap(this.map.googleMap!);
  }

  checkPolygonIntersection(): boolean {
    if (!this.polygon) return false;

    const newPolygonPath = this.polygon.getPath();

    for (const existingPolygonCoords of this.polygons) {
      const existingPolygon = new google.maps.Polygon({
        paths: existingPolygonCoords
      });

      // Verificar si algún punto del nuevo polígono está dentro de polígonos existentes
      for (let i = 0; i < newPolygonPath.getLength(); i++) {
        const point = newPolygonPath.getAt(i);
        if (google.maps.geometry.poly.containsLocation(point, existingPolygon)) {
          this.alertService.showWarning("El polígono no puede intersectar con zonas existentes.");
          return true;
        }
      }

      // Verificar si algún punto de polígonos existentes está dentro del nuevo polígono
      const existingPolygonPath = new google.maps.Polygon({ paths: existingPolygonCoords });
      for (let i = 0; i < existingPolygonPath.getPath().getLength(); i++) {
        const point = existingPolygonPath.getPath().getAt(i);
        if (google.maps.geometry.poly.containsLocation(point, this.polygon)) {
          this.alertService.showWarning("El polígono no puede intersectar con zonas existentes.");
          return true;
        }
      }
    }

    return false;
  }

  onSubmit() {
    if (this.form.invalid) {
      if (this.form.get('tNombre')?.hasError('pattern')) {
        this.alertService.showWarning("No debe ingresar solo espacios en blanco.");
        return;
      }

      if (this.form.get('dPrecio')?.hasError('pattern')) {
        this.alertService.showWarning("Formato incorrecto en el precio");
        return;
      }

      if (this.form.get('dPrecio')?.hasError('min') || this.form.get('dPrecio')?.hasError('max')) {
        this.alertService.showWarning("El precio debe ser mayor que 0 y menor que 10000.00");
        return;
      }

      if (this.form.get('iIdZonaFast')?.hasError('min')) {
        this.alertService.showWarning("No se permiten números negativos.");
        return;
      }

      this.form.markAllAsTouched();
      this.alertService.showWarning("Debe llenar todos los campos.");
      return;
    }

    if (!this.isPolygonDrawn) {
      this.alertService.showWarning("Debe tener un polígono en el mapa.");
      return;
    }

    // Validar intersección con otras zonas
    if (this.checkPolygonIntersection()) {
      return;
    }

    // Actualizar coordenadas del polígono
    this.finalPolygonCoords = this.tempPolygonCoords.length ? this.tempPolygonCoords : this.polygon!.getPath().getArray();

    const geoJSON = this.finalPolygonCoords;
    this.form.get('jPoligono')?.setValue(JSON.stringify(geoJSON));

    this.isEditable = false;
    if (this.polygon) {
      this.polygon.setEditable(false);
    }

    this.submit();
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }

  onCancel() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }
}

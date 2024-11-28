import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../../../shared/services/alert.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { GoogleMap, MapAdvancedMarker, MapPolygon } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-zone-add-modal',
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
    MatButtonModule,
    GoogleMap,
    MapAdvancedMarker,
    MapPolygon
  ],
  templateUrl: './zone-add-modal.component.html',
  styleUrl: './zone-add-modal.component.scss'
})
export class ZoneAddModalComponent {

  @ViewChild(GoogleMap) map!: GoogleMap;

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<this>);
  private readonly alertService = inject(AlertService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription: Subscription | undefined;
  private readonly data = inject<any>(MAT_DIALOG_DATA);

  form: FormGroup;
  colspan = 12;

  center = signal<google.maps.LatLngLiteral>({lat: 0, lng: 0}); 
  mapOptions: google.maps.MapOptions = {streetViewControl: false};
  markerOptions: google.maps.marker.AdvancedMarkerElementOptions = {gmpDraggable: false};

  drawingManager?: google.maps.drawing.DrawingManager;
  polygon?: google.maps.Polygon;
  tempPolygonCoords: google.maps.LatLng[] = [];
  finalPolygonCoords: google.maps.LatLng[] = [];
  isPolygonDrawn = false;
  showDrawPolygonButton = true;
  isEditable = true;

  polygons: google.maps.LatLngLiteral[][] =[];
  polygonOptions: google.maps.PolygonOptions = {
    fillColor: '#afb3bf',
    fillOpacity: 0.4,
    strokeColor: '#7373a3',
    strokeOpacity: 1,
    strokeWeight: 3,
  };

  constructor() {
    this.form = this.fb.group({
      tNombre: ['', [Validators.required, Validators.pattern(/\S+/)]],
      dPrecio: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(9999.99),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      jPoligono: ['', []],
      iIdSucursal: [this.data.branch.iIdSucursal]
    });
    this.polygons = this.data.polygons;
    this.center.set(JSON.parse(this.data.branch.jLatLng));
  }

  ngOnInit() {
    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      this.colspan = state.matches ? 6 : 12;
    });
  }

  ngAfterViewInit() {
    this.initDrawingManager();
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

    google.maps.event.addListener(this.drawingManager, 'polygoncomplete', (polygon: google.maps.Polygon) => {
      // Si ya se ha dibujado un polígono, eliminar el anterior
      if (this.polygon) {
        this.polygon.setMap(null);
      }

      this.polygon = polygon;
      this.tempPolygonCoords = polygon.getPath().getArray();

      google.maps.event.addListener(this.polygon.getPath(), 'set_at', () => {
        if (this.isEditable) {
          this.tempPolygonCoords = this.polygon!.getPath().getArray();
        }
      });

      google.maps.event.addListener(this.polygon.getPath(), 'insert_at', () => {
        if (this.isEditable) {
          this.tempPolygonCoords = this.polygon!.getPath().getArray();
        }
      });

      this.drawingManager?.setDrawingMode(null);
      this.isPolygonDrawn = true;
      this.showDrawPolygonButton = false;
    });
  }

  startDrawingPolygon() {
    if (this.isPolygonDrawn) {
      this.alertService.showWarning("Ya has dibujado un polígono. No puedes dibujar otro.");
      return;
    }

    this.drawingManager?.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
  }

  deletePolygon() {
    if (this.polygon) {
      this.polygon.setMap(null);
      this.polygon = undefined;
      this.tempPolygonCoords = [];
      this.finalPolygonCoords = [];
      this.form.get('jPoligono')?.setValue(null);
      this.isPolygonDrawn = false;
      this.showDrawPolygonButton = true;
      this.isEditable = true;
    }
  }

  checkPolygonIntersection(): boolean {
    if (!this.polygon) return false;
  
    const newPolygonPath = this.polygon.getPath();
  
    for (const existingPolygonCoords of this.polygons) {
      const existingPolygon = new google.maps.Polygon({
        paths: existingPolygonCoords
      });
  
      // Check if any point of the new polygon is inside the existing polygon
      for (let i = 0; i < newPolygonPath.getLength(); i++) {
        const point = newPolygonPath.getAt(i);
        if (google.maps.geometry.poly.containsLocation(point, existingPolygon)) {
          this.alertService.showWarning("El polígono no puede intersectar con zonas existentes.");
          return true;
        }
      }
  
      // Check if any point of existing polygons is inside the new polygon
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

      this.form.markAllAsTouched();
      this.alertService.showWarning("Debe llenar todos los campos.");
      return;
    }

    if (!this.isPolygonDrawn) {
      this.alertService.showWarning("Debe dibujar un polígono en el mapa.");
      return;
    }

    if (this.checkPolygonIntersection()) {
      this.alertService.showWarning("No debe haber una intersección con otro polígono.")
      return;
    }

    this.finalPolygonCoords = this.tempPolygonCoords;
    
    const geoJSON = this.finalPolygonCoords;
    this.form.get('jPoligono')?.setValue(JSON.stringify(geoJSON));

    this.isEditable = false;
    if (this.polygon) {
      this.polygon.setEditable(false);
    }

    this.submit();
  }

  submit() {
    // console.log(this.form.get('jPoligono')?.value);
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

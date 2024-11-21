import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../shared/services/alert.service';
import { Promotion } from '../shared/models/Promotion.model';
import { PromotionService } from '../shared/services/promotion.service';
import { CapitalizePipe } from '../shared/pipes/capitalize.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TimeFormatPipe } from '../shared/pipes/time-format.pipe';
import { FechaEspanolPipe } from '../shared/pipes/fecha-espanol.pipe';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CapitalizePipe,
    MatTooltipModule,
    TimeFormatPipe,
    FechaEspanolPipe
  ],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss'
})
export default class PromotionsComponent {

  private readonly errorService = inject(ErrorHandlerService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);
  private readonly promotionService = inject(PromotionService);

  promotions = signal<Promotion[]>([]);
  dataSourcePromotions = signal<MatTableDataSource<Promotion>>(
    new MatTableDataSource<Promotion>()
  );
  displayedColumns: string[] = ['tNombre', 'lPorFecha', 'lPorHora', 'lPorImporte', 'tTipoAplicacion', 'tTipoAplicar', 'dValorAplicar', 'actions'];

  expandedElement: Promotion | null = null;

  constructor() {
    effect(() => {
      this.dataSourcePromotions().data = this.promotions();
    });
  }

  ngOnInit() {
    this.loadPromotions();
  }

  loadPromotions() {
    this.promotionService.getPromotions().subscribe({
      next: (res) => {
        this.promotions.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  onViewDetails(promotion: Promotion) {

  }

  onAddPromotion() {
    
  }

  onEditPromotion(promotion: Promotion) {
  }

  onDeletePromotion(iIdZone: number) {
    
  }

  toggleRow(row: Promotion, event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isActionButton = target.closest('.main__table__actions__button');
    
    if (!isActionButton) {
      this.expandedElement = this.expandedElement === row ? null : row;
    }
  }
}

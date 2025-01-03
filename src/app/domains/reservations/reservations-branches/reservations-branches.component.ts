import { Component, inject, signal } from '@angular/core';
import { ReservationBranchCardComponent } from '../components/reservation-branch-card/reservation-branch-card.component';
import { ReservationService } from '../../shared/services/reservation.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { AuthService } from '../../shared/services/auth.service';
import { ReservationBranchResponse } from '../../shared/models/reservation-branch-response.model';

@Component({
  selector: 'app-reservations-branches',
  standalone: true,
  imports: [ReservationBranchCardComponent],
  templateUrl: './reservations-branches.component.html',
  styleUrl: './reservations-branches.component.scss'
})
export default class ReservationsBranchesComponent {

  private readonly reservationService = inject(ReservationService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly authService = inject(AuthService);

  currentBranchUser = this.authService.getIdSucursal();

  branches = signal<ReservationBranchResponse[]>([]);

  ngOnInit() {
    this.loadBranches();
  }

  loadBranches() {
    this.reservationService.getBranches().subscribe({
      next: (res) => {
        this.branches.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }
}
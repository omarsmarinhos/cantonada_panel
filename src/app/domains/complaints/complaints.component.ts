import { Component, inject, signal } from '@angular/core';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { ComplaintBranchCardComponent } from "./components/complaint-branch-card/complaint-branch-card.component";
import { ComplaintService } from '../shared/services/complaint.service';
import { ComplaintBranchResponse } from '../shared/models/complaint-branch-response.model';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [ComplaintBranchCardComponent],
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.scss'
})
export default class ComplaintsComponent {

  private readonly complaintService = inject(ComplaintService);
  private readonly errorService = inject(ErrorHandlerService);
  readonly authService = inject(AuthService);

  currentBranchUser = this.authService.getIdSucursal();

  branches = signal<ComplaintBranchResponse[]>([]);

  ngOnInit() {
    this.loadBranches();
  }

  loadBranches() {
    this.complaintService.getBranches().subscribe({
      next: (res) => {
        this.branches.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    })
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CollapsedService } from '../../services/collapsed.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    RouterModule,
    MatIconModule,
    ScrollingModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export default class LayoutComponent {
  private readonly collapsedService = inject(CollapsedService);
  isCollapsed = this.collapsedService.isCollapsed;

  toggleSizeSideBarContainer() {
    this.collapsedService.toggleCollapsed();
  }
}

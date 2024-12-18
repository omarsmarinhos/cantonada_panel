import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { CollapsedService } from '../../services/collapsed.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkWithHref,
    RouterLinkActive,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  private readonly collapsedService = inject(CollapsedService);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  user = this.authService.user;

  isCollapsed = this.collapsedService.isCollapsed;

  toggleSidebar() {
    this.collapsedService.toggleCollapsed();
  }

  openSideBar() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth > 1024) {
      this.isCollapsed.set(false);
    }
  }

  logout() {
    this.authService.logout();
    this.collapsedService.toggleCollapsed();
  }

}

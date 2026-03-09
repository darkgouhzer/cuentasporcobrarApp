import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class LayoutComponent {
  private readonly authService = inject(AuthService);

  sidebarOpen = signal(true);
  currentUser = this.authService.currentUser;

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }
}

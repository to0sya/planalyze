import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userMenuOpen = false;
  userName = 'planalyze.ig';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // const user = this.authService.getCurrentUser();
    // if (user) {
    //   this.userName = user.name || user.email;
    // }
  }
  
  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }
  
  logout(): void {
    // this.authService.logout();
    // this.router.navigate(['/login']);
  }
}

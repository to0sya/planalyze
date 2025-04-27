import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  active: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isCollapsed = false;
  menuItems: MenuItem[] = [
    { label: 'Content Calendar', icon: 'fa-calendar-alt', route: '/app/calendar', active: false },
    { label: 'New Post', icon: 'fa-image', route: '/app/post/new', active: false },
    { label: 'New Story', icon: 'fa-circle', route: '/app/story/new', active: false },
    { label: 'Analytics', icon: 'fa-chart-line', route: '/app/analytics', active: false },
    { label: 'Ad Targeting', icon: 'fa-bullseye', route: '/app/ad-targeting', active: false },
  ];
  
  constructor(private router: Router) {
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe((event: NavigationEnd) => {
    //   this.updateActiveMenuItem(event.url);
    // });
  }
  
  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  
  private updateActiveMenuItem(url: string): void {
    this.menuItems.forEach(item => {
      item.active = url.includes(item.route);
    });
  }
}

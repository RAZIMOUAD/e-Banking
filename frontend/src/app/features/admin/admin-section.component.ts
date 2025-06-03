import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subject, takeUntil, filter } from 'rxjs';

// Interfaces
interface Notification {
  id: number;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  icon: string;
  type: 'add-user' | 'warning' | 'currency' | 'system' | 'success';
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface RouteInfo {
  path: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-admin-section',
  templateUrl: './admin-section.component.html',
  styleUrls: ['./admin-section.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class AdminSectionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Component state
  currentRoute = 'dashboard';
  sidenavOpened = true;
  isLoading = false;

  // Route configuration
  private readonly routes: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard', icon: 'dashboard' },
    { path: 'agents', title: 'Agent Management', icon: 'people' },
    { path: 'devises', title: 'Currency Exchange', icon: 'currency_exchange' },
    { path: 'audit', title: 'Audit Logs', icon: 'fact_check' },
    { path: 'parametres', title: 'System Settings', icon: 'settings' },
    { path: 'logs', title: 'System Logs', icon: 'receipt_long' }
  ];

  // Mock data - In real app, these would come from services
  notifications: Notification[] = [
    {
      id: 1,
      title: 'New Agent Registration',
      message: 'Agent John Doe has submitted registration documents for review',
      time: new Date(Date.now() - 300000), // 5 minutes ago
      read: false,
      icon: 'person_add',
      type: 'add-user'
    },
    {
      id: 2,
      title: 'System Performance Alert',
      message: 'Server CPU usage has exceeded 85% threshold',
      time: new Date(Date.now() - 1800000), // 30 minutes ago
      read: false,
      icon: 'warning',
      type: 'warning'
    },
    {
      id: 3,
      title: 'Currency Rate Update',
      message: 'EUR exchange rate has been updated successfully',
      time: new Date(Date.now() - 3600000), // 1 hour ago
      read: true,
      icon: 'currency_exchange',
      type: 'currency'
    },
    {
      id: 4,
      title: 'Backup Completed',
      message: 'Daily system backup completed successfully',
      time: new Date(Date.now() - 86400000), // 1 day ago
      read: true,
      icon: 'backup',
      type: 'success'
    },
    {
      id: 5,
      title: 'Security Update',
      message: 'Security patches have been applied to the system',
      time: new Date(Date.now() - 172800000), // 2 days ago
      read: true,
      icon: 'security',
      type: 'system'
    }
  ];

  currentUser: User = {
    id: 1,
    name: 'Administrator',
    email: 'admin@ebanking.com',
    role: 'ADMIN'
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
    this.subscribeToRouteChanges();
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Initialization methods
  private initializeComponent(): void {
    this.setCurrentRouteFromUrl();
    this.loadNotifications();
  }

  private subscribeToRouteChanges(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (event: NavigationEnd) => {
          this.updateCurrentRoute(event.urlAfterRedirects);
        },
        error: (error) => {
          console.error('Route navigation error:', error);
          this.onError(error);
        }
      });
  }

  private setCurrentRouteFromUrl(): void {
    const currentUrl = this.router.url;
    this.updateCurrentRoute(currentUrl);
  }

  private updateCurrentRoute(url: string): void {
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1];

    if (this.routes.some(route => route.path === lastSegment)) {
      this.currentRoute = lastSegment;
    } else {
      this.currentRoute = 'dashboard';
    }

    this.cdr.detectChanges();
  }

  private loadUserData(): void {
    // In real app, load from auth service
    // this.authService.getCurrentUser().subscribe(user => this.currentUser = user);
  }

  private loadNotifications(): void {
    // In real app, load from notification service
    // this.notificationService.getNotifications().subscribe(notifications => this.notifications = notifications);
  }

  // Computed properties
  get notificationCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get unreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  // Public methods
  getPageTitle(): string {
    const route = this.routes.find(r => r.path === this.currentRoute);
    return route ? route.title : 'Dashboard';
  }

  setActiveRoute(route: string): void {
    this.currentRoute = route;
    this.cdr.detectChanges();
  }

  toggleSidenav(sidenav: any): void {
    sidenav.toggle();
    this.sidenavOpened = sidenav.opened;
  }

  // Notification methods
  getNotificationIconClass(type: string): string {
    const typeMap: { [key: string]: string } = {
      'add-user': 'add-user',
      'warning': 'warning',
      'currency': 'currency',
      'system': 'system',
      'success': 'success'
    };
    return typeMap[type] || '';
  }

  markAllAsRead(): void {
    if (this.notificationCount === 0) {
      return;
    }

    this.notifications.forEach(notification => {
      notification.read = true;
    });

    this.showSnackBar('All notifications marked as read', 'success');
    this.cdr.detectChanges();
  }

  markAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.showSnackBar('Notification marked as read', 'success');
      this.cdr.detectChanges();
    }
  }

  viewAllNotifications(): void {
    // Navigate to notifications page or open notifications panel
    this.router.navigate(['/admin/notifications']);
    this.showSnackBar('Navigating to notifications page', 'info');
  }

  // User menu methods
  openProfile(): void {
    this.router.navigate(['/admin/profile']);
    this.showSnackBar('Opening user profile', 'info');
  }

  openSettings(): void {
    this.router.navigate(['/admin/account-settings']);
    this.showSnackBar('Opening account settings', 'info');
  }

  openHelp(): void {
    // Open help documentation or support page
    window.open('/help', '_blank');
    this.showSnackBar('Opening help documentation', 'info');
  }

  openSearch(): void {
    // Implement global search functionality
    this.showSnackBar('Search functionality coming soon', 'info');
  }

  // Logout functionality
  logout(): void {
    this.isLoading = true;

    // Show confirmation dialog (optional)
    if (confirm('Are you sure you want to logout?')) {
      try {
        // Clear any stored authentication data
        this.clearAuthData();

        // Show logout message
        this.showSnackBar('Logging out...', 'info');

        // Simulate logout delay (remove in real implementation)
        setTimeout(() => {
          // Navigate to login page
          this.router.navigate(['/auth/login']).then(() => {
            this.isLoading = false;
            this.showSnackBar('Successfully logged out', 'success');
          }).catch(() => {
            this.isLoading = false;
            this.showSnackBar('Logout completed', 'success');
            // Fallback: redirect using window.location
            window.location.href = '/auth/login';
          });
        }, 1000);

      } catch (error) {
        this.isLoading = false;
        console.error('Logout error:', error);
        this.showSnackBar('Logout failed. Please try again.', 'error');
      }
    } else {
      this.isLoading = false;
    }
  }

  private clearAuthData(): void {
    // Clear localStorage
    if (typeof Storage !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      localStorage.clear(); // Clear all localStorage data
    }

    // Clear sessionStorage
    if (typeof Storage !== 'undefined') {
      sessionStorage.clear();
    }

    // Clear any cookies (if using cookie-based auth)
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }

  // Utility methods
  trackNotification(index: number, notification: Notification): number {
    return notification.id;
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const config = {
      duration: 3000,
      horizontalPosition: 'end' as const,
      verticalPosition: 'top' as const,
      panelClass: [`snackbar-${type}`]
    };

    this.snackBar.open(message, 'Close', config);
  }

  // Handle component errors
  onError(error: any): void {
    console.error('Admin component error:', error);
    this.showSnackBar('An error occurred. Please try again.', 'error');
  }
}

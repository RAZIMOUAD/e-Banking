import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  icon: string;
  type?: string; // Pour déterminer la classe d'icône
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
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
    MatDividerModule
  ],
  animations: [
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
export class AdminSectionComponent implements OnInit {
  // Mock data - would come from services in real implementation
  notifications: Notification[] = [
    {
      id: 1,
      title: 'New agent registered',
      message: 'Agent John Doe has registered and is awaiting approval',
      time: new Date(),
      read: false,
      icon: 'person_add',
      type: 'add-user'
    },
    {
      id: 2,
      title: 'System alert',
      message: 'Server load is above 80%',
      time: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
      icon: 'warning',
      type: 'warning'
    },
    {
      id: 3,
      title: 'New currency added',
      message: 'EUR has been added to the system',
      time: new Date(Date.now() - 86400000), // 1 day ago
      read: true,
      icon: 'attach_money',
      type: 'currency'
    }
  ];

  currentUser: User = {
    id: 1,
    name: 'Admin User',
    email: 'admin@ebanking.com',
    role: 'ADMIN'
  };

  get notificationCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize any required data
  }

  // Méthode pour déterminer la classe CSS de l'icône de notification
  getNotificationIconClass(icon: string): string {
    switch(icon) {
      case 'person_add':
        return 'add-user';
      case 'warning':
        return 'warning';
      case 'attach_money':
        return 'currency';
      default:
        return '';
    }
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }

  // Marquer une notification comme lue
  markAsRead(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  logout(): void {
    // Implement logout logic
    console.log('Logging out...');
    // Navigate to login page
    this.router.navigate(['/auth/login']);
  }
}

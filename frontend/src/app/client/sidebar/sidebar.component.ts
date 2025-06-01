import { Component } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  liens = [
    { label: 'Tableau de bord', route: '/dashboard' },
    { label: 'Mes comptes', route: '/comptes' },
    { label: 'Historique', route: '/transactions' },
    { label: 'Virements', route: '/virements' },
    { label: 'Recharges', route: '/recharges' },
    { label: 'Profil', route: '/profil' },
    { label: 'Alertes', route: '/alertes' },
  ];

  virementOuvert = false;

  toggleVirement() {
    this.virementOuvert = !this.virementOuvert;
  }

}

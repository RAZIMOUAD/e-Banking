import { Component , OnInit } from '@angular/core';
import { ServiceClientService , ClientProfil } from '../service-client.service';

@Component({
  selector: 'app-profil-client',
  templateUrl: './profil-client.component.html',
  styleUrl: 'profil-client.component.css'
})
export class ProfilClientComponent {
  profil: ClientProfil | null = null;

  constructor(private clientService: ServiceClientService) {}

  ngOnInit(): void {
    const clientId = 37; // Tu pourras plus tard le récupérer via un service d'auth
    this.clientService.getClientById(clientId).subscribe({
      next: (data) => this.profil = data,
      error: (err) => console.error('Erreur lors du chargement du profil :', err)
    });
  }
}

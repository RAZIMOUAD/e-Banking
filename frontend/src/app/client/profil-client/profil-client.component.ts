import { Component } from '@angular/core';

@Component({
  selector: 'app-profil-client',
  templateUrl: './profil-client.component.html'
})
export class ProfilClientComponent {
  // TODO: charger depuis backend le profil réel
  profil = {
    nom: 'Zidane',
    prenom: 'Noufissa',
    email: 'zidane@gmail.com',
    tel: '+212-6600000',
    addresse: 'Marrakech',
    nationalite: 'Marocaine'
  };
}

import { Component, Input } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-register-card',
  standalone: true,
  imports : [
    NgOptimizedImage],
  templateUrl: './register-card.component.html',
  styleUrls: ['./register-card.component.css'],
})
export class RegisterCardComponent {
  @Input() nom: string = 'NOM';
  @Input() prenom: string = 'PRÉNOM';
  @Input() cin: string = 'XXXXXXX';
  @Input() dateNaissance: string = 'JJ/MM/AAAA';
  @Input() nationalite: string = 'Pays';
  @Input() genre: string = 'Genre';
  @Input() adresse: string = 'Adresse';
  @Input() numTel: string = '+212...';
  @Input() email: string = 'email@banque.com';

  get fullName(): string {
    return `${this.prenom} ${this.nom}`.toUpperCase();
  }
}

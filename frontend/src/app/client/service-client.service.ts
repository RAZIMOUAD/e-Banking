import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClientProfil {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  genre?: string;
  nationalite?: string;
  numTel: string;
  adresse: string;
  cin?: string;
}


export interface CompteResponseDTO {
  id: number;
  IBAN: string;
  type: string;
  solde: number;
  devise: string;
  dateCreation: Date;
  plafond: number;
  soldeDisponible: number;
  actif: boolean;
}

export interface TransactionResponseDTO {
  id: number;
  reference: string;
  montant: number;
  type: string;
  date: Date;
  statut: string;
  mode: string;
  motif: string;
  source: CompteResponseDTO;
  cible: CompteResponseDTO;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceClientService {
  private baseUrl = 'http://localhost:9090/api/client';

  constructor(private http: HttpClient) {}

  getClientById(id: number): Observable<ClientProfil> {
    return this.http.get<ClientProfil>(`${this.baseUrl}/${id}`);
  }

  getComptes(clientId: number) {
    return this.http.get<any>(`${this.baseUrl}/ccc/${clientId}`);
  }

  effectuerVirement(data: any) {
    return this.http.post(`${this.baseUrl}/virement`, data);
  }

  effectuerVirementExterne(data: any) {
    return this.http.post(`${this.baseUrl}/virement-externe`, data);
  }


  getTransactionsByCompte(compteId: number): Observable<TransactionResponseDTO[]> {
    return this.http.get<TransactionResponseDTO[]>(`${this.baseUrl}/compte/${compteId}/transactions`);
  }
}

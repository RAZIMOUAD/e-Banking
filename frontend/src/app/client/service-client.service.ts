import { Injectable } from '@angular/core';
import { HttpClient,  HttpParams } from '@angular/common/http';
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
  effectuerVirementInterne(idSource: number, idCible: number, montant: number, motif: string, mode: string): Observable<any> {
    const params = new HttpParams()
      .set('idSource', idSource)
      .set('idCible', idCible)
      .set('montant', montant)
      .set('motif', motif)
      .set('mode', mode);

    return this.http.post(`${this.baseUrl}/virement/interne`, null, { params });
  }

  effectuerVirementExterne(
    idSource: number, montant: number, motif: string, mode: string,
    nomBanque: string, nomBeneficiaire: string, iban: string): Observable<any> {

    const params = new HttpParams()
      .set('idSource', idSource)
      .set('montant', montant)
      .set('motif', motif)
      .set('mode', mode)
      .set('nomBanque', nomBanque)
      .set('nomBeneficiaire', nomBeneficiaire)
      .set('iban', iban);

    return this.http.post(`${this.baseUrl}/virement/externe`, null, { params });
  }


  //effectuerVirementExterne(data: any) {
    //return this.http.post(`${this.baseUrl}/virement-externe`, data);
  //}


  getTransactionsByCompte(compteId: number): Observable<TransactionResponseDTO[]> {
    return this.http.get<TransactionResponseDTO[]>(`${this.baseUrl}/compte/${compteId}/transactions`);
  }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EspaceagentService {
  private baseUrl ="http://localhost:9090";
  private clients: Observable<any> | undefined;
  private transactions: Observable<any> | undefined;
  constructor(private _httpService: HttpClient){ }
  getAllClients(): Observable<any> {
    this.clients = this._httpService.get<any>(`${this.baseUrl}/api/v1/agent/clients`);
     return this.clients;
  }

  getAllTransactions(): Observable<any> {
    return this.transactions = this._httpService.get<any>(`${this.baseUrl}/api/v1/agent/transactions`);
  }
  deleteClient(id: number): Observable<void> {
    console.log("jdjjdjdj" , id)
    return this._httpService.delete<void>(`${this.baseUrl}/api/v1/agent/deleteclient/${id}`);
  }
  deleteTransaction(id:number):Observable<void>{
    return this._httpService.delete<void>(`${this.baseUrl}/api/v1/agent/deletetransaction/${id}`);
  }
  createClient(clientData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._httpService.post<any>(`${this.baseUrl}/api/v1/agent/addclient`, clientData);
  }

}

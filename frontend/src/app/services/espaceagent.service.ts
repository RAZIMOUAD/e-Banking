import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EspaceagentService {
  private baseUrl ="http://localhost:9090/api/v1/agent/clients";
  private clients: Observable<any> | undefined;
  constructor(private _httpService: HttpClient){ }
  getAllClients(): Observable<any> {
    this.clients = this._httpService.get<any>("http://localhost:9090/api/v1/agent/clients");
     return this.clients;

  }
}

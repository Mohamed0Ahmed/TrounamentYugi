import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  resetLeague(): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/league/reset`,
      {},
      { responseType: 'text' }
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ParkingRequest } from '../model/parkingRequest';
import { ParkingDTO } from '../model/parkingDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private baseUrl = 'http://129.88.210.194:8080/search';  // Replace with your actual backend URL

  constructor(private http: HttpClient) { }

  getAvailableParking(parkingRequest: ParkingRequest): Observable<ParkingDTO[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ParkingDTO[]>(
      `${this.baseUrl}/parkingdisponible`,
      parkingRequest,
      { headers }
    );
  }
}


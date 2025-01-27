import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ParkingRequest } from '../model/parkingRequest';
import { ParkingDTO } from '../model/parkingDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private baseUrl = 'http://localhost:2200/search';  // Replace with your actual backend URL

  constructor(private http: HttpClient) { }

  // API call to fetch available parkings based on user search
  getAvailableParking(parkingRequest: ParkingRequest): Observable<ParkingDTO[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ParkingDTO[]>(
      `${this.baseUrl}/parkingdisponible`,
      parkingRequest,
      { headers }
    );
  }
}


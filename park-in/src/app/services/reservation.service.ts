import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationDTO } from '../model/reservationDTO';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private baseUrl = 'http://localhost:2200/reservation';

  constructor(private http: HttpClient){
  }
  getReservations(userId : number) : Observable<ReservationDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<ReservationDTO[]>(
      `${this.baseUrl}/search_by_conducteur/${userId}`, {headers});
  }
}


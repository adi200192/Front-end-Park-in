import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationDTO } from '../model/reservationDTO';
import {ReservationRequest} from '../model/reservationRequest';


@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private baseUrl = 'http://localhost:2200/reservation';

  constructor(private http: HttpClient){}
  getReservations(reservationRequest : ReservationRequest) : Observable<ReservationDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<ReservationDTO[]>(
      `${this.baseUrl}/search_by_conducteur`,
      reservationRequest,
      {headers});
  }

  cancelReservation(reservationId: number): Observable<ReservationDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<ReservationDTO>(
      `${this.baseUrl}/annule`,
      null,
      {
        headers,
        params: { id: reservationId.toString() } // Send the ID as a request parameter
      }
    );
  }
}


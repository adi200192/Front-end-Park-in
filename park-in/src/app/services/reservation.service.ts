import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ReservationDTO} from '../model/reservationDTO';
import {ReservationRequest} from '../model/reservationRequest';


@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private baseUrl = 'http://localhost:2200/reservation';

  constructor(private http: HttpClient) {
  }

  getReservations(reservationRequest: ReservationRequest): Observable<ReservationDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<ReservationDTO[]>(
      `${this.baseUrl}/search_by_conducteur`,
      reservationRequest,
      {headers});
  }

  cancelReservation(reservationId: number, reservationState: string): Observable<ReservationDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.patch<ReservationDTO>(
      `${this.baseUrl}/validateOrCancel`,
      {
        headers,
        params: {
          id: reservationId.toString(),
          etat: reservationState
        }
      }
    );
  }
}


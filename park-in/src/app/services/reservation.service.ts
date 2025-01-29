import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ReservationDTO} from '../model/reservationDTO';
import {ConducteurRequest} from '../model/conducteurRequest';
import {ReservationRequest} from '../model/reservationRequest';


@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private baseUrl = 'http://localhost:2200/reservation';

  constructor(private http: HttpClient) {
  }

  getReservations(conducteurRequest: ConducteurRequest): Observable<ReservationDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<ReservationDTO[]>(
      `${this.baseUrl}/search_by_conducteur`,
     conducteurRequest,
      {headers});
  }

  cancelReservation(reservationId: number, reservationState: string): Observable<ReservationDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.patch<ReservationDTO>(
      `${this.baseUrl}/validateOrCancel`,
      null,
      {
        headers,
        params: {
          id: reservationId,
          etat: reservationState
        }
      }
    );
  }
  addReservation(reservationRequest: ReservationRequest): Observable<ReservationDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<ReservationDTO>(
      `${this.baseUrl}/add`,
      reservationRequest,
      { headers }
    );
  }

}


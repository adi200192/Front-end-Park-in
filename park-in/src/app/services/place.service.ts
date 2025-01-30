import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlaceDTO } from '../model/placeDTO';
import { PlaceRequest } from '../model/placeRequest';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private baseUrl = 'http://129.88.210.194:8080/api/places';

  constructor(private http: HttpClient) {}

  getPlacesDisponibles(placeRequest: PlaceRequest): Observable<PlaceDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<PlaceDTO[]>(
      `${this.baseUrl}/disponible`,
      placeRequest,
      { headers }
    );
  }
}

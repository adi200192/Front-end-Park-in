import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiKey = "AIzaSyDBj2yq4hzXhv-iVN0E5o22jZ2jKV88FMM"
  private geocodingUrl: string = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http : HttpClient) {}
  getCoordinates(address: string): Observable<any> {
    const url = `${this.geocodingUrl}?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    return this.http.get(url);
  }
}

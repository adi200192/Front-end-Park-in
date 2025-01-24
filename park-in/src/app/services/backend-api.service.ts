import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  private api= 'https://your-backend-api-url.com';

  constructor(private http: HttpClient) {}

  getData(endpoint: string): Observable<any> {
    const url = `${this.api}/${endpoint}`;
    return this.http.get(url);
  }

  // Example method to post data to the backend
  postData(endpoint: string, data: any): Observable<any> {
    const url = `${this.api}/${endpoint}`;
    return this.http.post(url, data);
  }

  // Add other methods as needed
}

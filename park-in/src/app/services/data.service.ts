import { Injectable } from '@angular/core';
import { ParkingDTO } from '../model/parkingDTO';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private parkings: ParkingDTO[] = [];

  setMessage(data: ParkingDTO[]) {
    this.parkings = data;
  }

  getMessage(): ParkingDTO[] {
    return this.parkings;
  }
}

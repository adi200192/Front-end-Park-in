import { Injectable } from '@angular/core';
import { ParkingDTO } from '../model/parkingDTO';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private parkings: ParkingDTO[] = [];
  private typePlace : string = ''
  private pmr : boolean = false
  private dateDebut : string = ''
  private dateFin : string = ''

  setMessage(data: ParkingDTO[]) {
    this.parkings = data;
  }

  setType(typePlace : string,){
    this.typePlace = typePlace
  }

  getType(){
    return this.typePlace
  }

  setPmr(pmr : boolean){
    this.pmr = pmr;
  }

  getPmr(){
    return this.pmr
  }

  setDateDebut(dateDebut : string){
    this.dateDebut = dateDebut
  }
  getDateDebut(){
    return this.dateDebut;
  }

  setDateFin(dateFin : string){
    this.dateFin =  dateFin
  }
  getDateFin(){
    return this.dateFin;
  }

  getMessage(): ParkingDTO[] {
    return this.parkings;
  }
}

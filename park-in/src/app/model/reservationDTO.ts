import {ParkingDTO} from './parkingDTO';

export interface PlaceDTO {
  id: string;
  type: string;
  pmr: boolean;
  parking : ParkingDTO
}
export interface ReservationDTO {
  id: number;
  etat: string;
  dateDebut: Date;
  dateFin: Date;
  facture: number;
  qrCode?: string;
  place: PlaceDTO;
  imageUrl : string;
}

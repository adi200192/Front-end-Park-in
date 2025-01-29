import { ParkingDTO } from './parkingDTO';

export interface PlaceDTO {
  id: string;
  type: string;
  pmr: boolean;
  parking: ParkingDTO;
}

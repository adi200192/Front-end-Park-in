export interface ParkingRequest {
    latitude: number;
    longitude: number;
    dateDebut: string;
    dateFin: string;   
    pmr: boolean;
    type: string;
    hauteur: number;
    typeOuvrage: string;
  }
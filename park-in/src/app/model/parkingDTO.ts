export interface ParkingDTO {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    nbPlaces: number;
    distance : number;
    typeOuvrage: string;
    hauteurMax : number;
    nbPmr : number;
    tarif1h : number;
    url : string;
    imageUrl : string;
  }

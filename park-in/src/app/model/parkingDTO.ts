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
  nbPMR : number;
  tarif1h : number;
  url : string;
  imageUrl : string;
}

import {PlaceDTO} from './reservationDTO';
export interface ReservationRequest{
       dateDebut : Date
       dateFin : Date,
       facture : number,
       place : string,
       conducteur : string,
       // qrCode : string
}

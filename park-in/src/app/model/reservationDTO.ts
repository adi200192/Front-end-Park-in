export interface ReservationDTO {
  id: number;
  etat: string;
  dateDebut: string;   // LocalDateTime should be represented as a string in Angular
  dateFin: string;
  facture : number;
  // qrCode: Uint8Array;
  // place: PlaceDTO;
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.css'
})
export class CancelComponent {
  parkings = [
    {
      imageUrl: 'assets/park1.jpg',
      nom: "Parking Neyrpic",
      type: "Couvert",
      adresse: "Neyrpic 123, Av Ismail",
      distance: "20km",
      tarif: 4.50,
      pmr: true,
      hauteur: 1.90,
      reservationDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)  // Réservation dans 3 jours
    },
    {
      imageUrl: 'assets/park2.jpg',
      nom: "Parking Grand Place",
      type: "Ouvert",
      adresse: "18 GP, avenue",
      distance: "10km",
      tarif: 4.50,
      pmr: false,
      hauteur: 250,
      reservationDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)  // Réservation dans 1 jour
    },
    {
      imageUrl: 'assets/park3.png',
      nom: "Parking Central Station",
      type: "Couvert",
      adresse: "45 Rue de la Gare, 75001 Paris",
      distance: "5km",
      tarif: 6.00,
      pmr: true,
      hauteur: 2.00,
      reservationDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)  // Réservation dans 5 jours
    },
    {
      imageUrl: 'assets/park1.jpg',
      nom: "Parking Villeurbanne",
      type: "Extérieur",
      adresse: "Place Wilson, 69100 Villeurbanne",
      distance: "8km",
      tarif: 5.00,
      pmr: false,
      hauteur: 2.20,
      reservationDate: new Date(new Date().getTime() + 1.5 * 24 * 60 * 60 * 1000)  // Réservation dans 1.5 jours
    },
    {
      imageUrl: 'assets/park2.jpg',
      nom: "Parking Nice Étoile",
      type: "Couvert",
      adresse: "12 Avenue Jean Médecin, 06000 Nice",
      distance: "2km",
      tarif: 7.00,
      pmr: true,
      hauteur: 1.80,
      reservationDate: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000)  // Réservation dans 4 jours
    }
  ];

  // Fonction pour calculer le temps restant en heures
  getRemainingTime(reservationDate: Date): number {
    const now = new Date();
    const diffMs = new Date(reservationDate).getTime() - now.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60)); // Convertir en heures
  }

  isCancellationDisabled(reservationDate: Date): boolean {
    return this.getRemainingTime(reservationDate) < 48;
  }
  canCancel(parking: any): boolean {
    const now = new Date();
    const reservationTime = new Date(parking.dateReservation);
  
    if (isNaN(reservationTime.getTime())) {
      console.error(`Invalid date for reservation: ${parking.nom}`);
      return false;
    }
  
    const diffInMilliseconds = reservationTime.getTime() - now.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  
    return diffInHours >= 48;
  }
  
}

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
      tarif: 4.50,
      pmr: true,
      hauteur: 1.90,
      dateDebut: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),// 3 days later
      dateFin : new Date(new Date().getTime())
    },
    {
      imageUrl: 'assets/park2.jpg',
      nom: "Parking Grand Place",
      type: "Ouvert",
      adresse: "18 GP, avenue",
      tarif: 4.50,
      pmr: false,
      hauteur: 250,
      dateDebut : new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day later
      dateFin : new Date(new Date().getTime())
    }
  ];

  // Function to calculate the remaining time in hours
  getRemainingTime(reservationDate: Date): number {
    const now = new Date();
    const diffMs = new Date(reservationDate).getTime() - now.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60));
  }

  // Function to check if cancellation is disabled (if less than 48 hours)
  isCancellationDisabled(reservationDate: Date): boolean {
    return this.getRemainingTime(reservationDate) < 48;
  }
}

import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReservationService} from '../../services/reservation.service';
import {ReservationDTO} from '../../model/reservationDTO';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.css'
})
export class CancelComponent implements OnInit{
  reservations : ReservationDTO[] = [];
  reservationRequest = {
    id :  sessionStorage.getItem('userId') || '',
    abonne : false
  }
  constructor(private reservationService : ReservationService) {}
  ngOnInit() {
    this.reservationService.getReservations(this.reservationRequest).subscribe({
      next: (data) => {
        this.reservations = data.map((reservation) => ({
          ...reservation,
          imageUrl:  this.getRandomImage()
        }));
        console.log('Réservations récupérées:', this.reservations);
        console.log(this.reservationRequest)
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des réservations:', err);
      }
    });
  }

  cancelReservation(reservationId : number, reservationState : string): void {
    this.reservations = this.reservations.map((reservation) =>
      reservation.id === reservationId
        ? { ...reservation, etat: reservationState } // Modify the reservation locally
        : reservation
    );
  this.reservationService.updateReservation(reservationId,reservationState).subscribe({
    next : (updatedReservation) => {
      console.log('Réservation annulée:', updatedReservation);
    }
  })
}
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

  getRandomImage(): string {
    const images = [
      './assets/park1.jpg',
      './assets/park2.jpg',
      './assets/park3.png'
    ];
    return images[Math.floor(Math.random() * images.length)];
  }

  // parkings = [
  //   {
  //     imageUrl: 'assets/park1.jpg',
  //     nom: "Parking Neyrpic",
  //     type: "Couvert",
  //     adresse: "Neyrpic 123, Av Ismail",
  //     tarif: 4.50,
  //     pmr: true,
  //     hauteur: 1.90,
  //     dateDebut: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),// 3 days later
  //     dateFin : new Date(new Date().getTime())
  //   },
  //   {
  //     imageUrl: 'assets/park2.jpg',
  //     nom: "Parking Grand Place",
  //     type: "Ouvert",
  //     adresse: "18 GP, avenue",
  //     tarif: 4.50,
  //     pmr: false,
  //     hauteur: 250,
  //     dateDebut : new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day later
  //     dateFin : new Date(new Date().getTime())
  //   }
  // ];
}

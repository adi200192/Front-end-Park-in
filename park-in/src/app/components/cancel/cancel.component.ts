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
        ? { ...reservation, etat: reservationState }
        : reservation
    );
  this.reservationService.updateReservation(reservationId,reservationState).subscribe({
    next : (updatedReservation) => {
      console.log('Réservation annulée:', updatedReservation);
    }
  })
}
  getRemainingTime(reservationDate: Date): number {
    const now = new Date();
    const diffMs = new Date(reservationDate).getTime() - now.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60));
  }

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

}

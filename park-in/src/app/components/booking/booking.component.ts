import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {ReservationService} from '../../services/reservation.service';
import {DataService} from '../../services/data.service';
import {PlaceService} from '../../services/place.service';
import {async} from 'rxjs';


@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  selectedParking: any;
  dateFin: string | null = null;
  reservationId : number = 0;
  facture : number = 0;
  @ViewChild('authDialog') authDialog!: TemplateRef<any>;
  @ViewChild('paymentFailedDialog') paymentFailedDialog!: TemplateRef<any>;
  @ViewChild('paymentSuccessDialog') paymentSuccessDialog!: TemplateRef<any>;

  structuredData: any = {}; // Stores places grouped by Bloc → Étage → Aile
  blocs: string[] = [];
  etages: string[] = [];
  ailes: string[] = [];
  places: string[] = [];

  selectedBloc: string = '';
  selectedEtage: string = '';
  selectedAile: string = '';
  selectedPlace: string = '';

  autoAssign: boolean = false;

  id: string | null = null; // Store the driver ID

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private reservationService: ReservationService,
    private dataService: DataService,
    private placeService: PlaceService
  ) {
  }

  ngOnInit() {
    this.id = sessionStorage.getItem('userId');
    console.log("ID du conducteur récupéré:", this.id);

    this.route.queryParams.subscribe(params => {
      this.dateFin = params['dateFin'] || null;
      this.selectedParking = {
        id: params['id'],
        imageUrl: params['imageUrl'],
        nom: params['nom'],
        tarif1h: params['tarif1h'],
        tarif2h : params['tarif2h'],
        tarif3h : params['tarif3h'],
        tarif4h : params['tarif4h'],
        tarif24h : params['tarif24h'],
        adresse: params['adresse'],
        url: params['url'],
        dateDebut: params['dateDebut'],
        dateFin: params['dateFin']
      };
    });
    console.log(this.selectedParking)
    this.getPlacesDisponibles();
    this.facture = this.calculerFacture();
  }

  calculerFacture(): number {

    let total = 0;

    const dateDebut = new Date(this.selectedParking.dateDebut);
    const dateFin = new Date(this.selectedParking.dateFin);

    // Calculate duration in hours
    const durationInMs = dateFin.getTime() - dateDebut.getTime();
    const durationInHours = durationInMs / (1000 * 60 * 60); // Convert milliseconds to hours

    console.log(`Durée de réservation : ${durationInHours} heures`);


    if (durationInHours <= 1) {
      total = this.selectedParking.tarif1h;
    } else if (durationInHours <= 2) {
      total = this.selectedParking.tarif2h;
    } else if (durationInHours <= 3) {
      total = this.selectedParking.tarif3h;
    } else if (durationInHours <= 4) {
      total = this.selectedParking.tarif4h;
    } else if (durationInHours > 4 && durationInHours <= 24) {
      total = this.selectedParking.tarif24h;
    } else {
      // If duration exceeds 24h, apply 24h tariff for each full day + hourly tariff for remaining hours
      const fullDays = Math.floor(durationInHours / 24);
      const remainingHours = durationInHours % 24;

      total = fullDays * this.selectedParking.tarif24h;

      if (remainingHours > 4) {
        total += this.selectedParking.tarif24h; // Charge another full day if remaining hours exceed 4
      } else if (remainingHours > 3) {
        total += this.selectedParking.tarif4h;
      } else if (remainingHours > 2) {
        total += this.selectedParking.tarif3h;
      } else if (remainingHours > 1) {
        total += this.selectedParking.tarif2h;
      } else if (remainingHours > 0) {
        total += this.selectedParking.tarif1h;
      }
    }
    console.log(`Montant total à payer : ${total} €`);
    return total;
  }

  getPlacesDisponibles() {
    const placeRequest = {
      parkingId: this.selectedParking.id,
      typePlace: this.dataService.getType(),
      pmr: this.dataService.getPmr(),
      facture : this.facture,
      dateDebut: this.dataService.getDateDebut(),
      dateFin: this.dataService.getDateFin()
    };

    console.log("Requesting places with:", placeRequest);

    this.placeService.getPlacesDisponibles(placeRequest).subscribe({
      next: (places) => {
        console.log('Places received:', places);
        this.processPlaces(places);
      },
      error: (err) => {
        console.error('Error fetching places:', err);
      }
    });
  }

  processPlaces(places: any[]) {
    this.structuredData = {};
    this.blocs = [];

    places.forEach(place => {
      const parsed = this.parsePlaceId(place.id);
      if (parsed) {
        if (!this.structuredData[parsed.bloc]) {
          this.structuredData[parsed.bloc] = {};
          this.blocs.push(parsed.bloc);
        }
        if (!this.structuredData[parsed.bloc][parsed.etage]) {
          this.structuredData[parsed.bloc][parsed.etage] = {};
        }
        if (!this.structuredData[parsed.bloc][parsed.etage][parsed.aile]) {
          this.structuredData[parsed.bloc][parsed.etage][parsed.aile] = [];
        }
        this.structuredData[parsed.bloc][parsed.etage][parsed.aile].push(parsed.place);
      }
    });

    console.log("Updated Structured Data:", this.structuredData);
  }

  parsePlaceId(placeId: string) {
    const regex = /^(.+?)_B(\d+)_E(\d+)_([A-Z]+)_P(\d+)$/;
    const match = placeId.match(regex);

    if (match) {
      return {
        parkingId: match[1],
        bloc: `Bloc ${match[2]}`,
        etage: `Étage ${match[3]}`,
        aile: `Aile ${match[4]}`,
        place: `Place ${match[5]}`
      };
    }
    console.error(`Invalid ID format: ${placeId}`);
    return null;
  }

  onBlocChange() {
    this.etages = this.selectedBloc ? Object.keys(this.structuredData[this.selectedBloc] || {}) : [];
    this.selectedEtage = '';
    this.selectedAile = '';
    this.selectedPlace = '';
    this.ailes = [];
    this.places = [];
  }

  onEtageChange() {
    this.ailes = this.selectedEtage ? Object.keys(this.structuredData[this.selectedBloc][this.selectedEtage] || {}) : [];
    this.selectedAile = '';
    this.selectedPlace = '';
    this.places = [];
  }

  onAileChange() {
    this.places = this.selectedAile ? this.structuredData[this.selectedBloc][this.selectedEtage][this.selectedAile] || [] : [];
    this.selectedPlace = '';
  }

  handleAutoAssign() {
    if (this.autoAssign) {
      this.selectedBloc = this.getRandomItem(this.blocs);
      this.onBlocChange();
      this.selectedEtage = this.getRandomItem(this.etages);
      this.onEtageChange();
      this.selectedAile = this.getRandomItem(this.ailes);
      this.onAileChange();
      this.selectedPlace = this.getRandomItem(this.places);
    } else {
      this.selectedBloc = '';
      this.selectedEtage = '';
      this.selectedAile = '';
      this.selectedPlace = '';
    }
  }

  verifierAuthentification() {
    this.authService.getUser().subscribe(user => {
      if (!user) {
        console.warn("Utilisateur non connecté !");

        // Ouvrir le dialogue directement sans créer un autre composant
        this.dialog.open(this.authDialog, {
          width: '300px',
          data: { message: "Veuillez vous connecter pour réserver un parking." }
        }).afterClosed().subscribe(() => {
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        });

      } else {
        this.confirmSelection();
      }
    });
  }

  cancelNotification() {
    const endTime = new Date(this.dataService.getDateFin());
    const notificationTime = new Date(endTime.getTime() - 10 * 60000);
    const now = new Date();
    const timeUntilNotification = notificationTime.getTime() - now.getTime();

    if (timeUntilNotification > 0) {
      console.log(`Notification programmée dans ${timeUntilNotification / 1000} secondes`);
      setTimeout(() => {
        this.authService.sendWebNotification("Votre stationnement se termine bientôt !");
      }, timeUntilNotification);
    }
  }

  retryPayment() {
    this.dialog.closeAll();
    this.router.navigate(['/home']);
  }

  simulerPaiement(reservationId: number) {
    const paiementSuccess = Math.random() < 0.5;
    const statut = paiementSuccess ? "CONFIRMED" : "CANCELLED";
    console.log(statut);

    this.reservationService.updateReservation(reservationId, statut).subscribe({
      next: (response) => {
        console.log("Confirmation :", response);
        if (statut === "CANCELLED") {
          this.dialog.open(this.paymentFailedDialog, {
            width: '350px',
            data: { message: "Le paiement a échoué. Veuillez réessayer." }
          }).afterClosed().subscribe(() => {
            this.router.navigate(['/home']); // Redirect to home page after closing
          });
        } else {
          this.dialog.open(this.paymentSuccessDialog, {
            width: '350px',
            data: { message: "Le paiement a été effectué avec succès ! 🎉" }
          }).afterClosed().subscribe(() => {
            this.router.navigate(['/home']); // Redirect to home after success
          });
        }

      }
    });
  }

  getRandomItem(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }

  confirmSelection() {
    if (!this.selectedBloc || !this.selectedEtage || !this.selectedAile || !this.selectedPlace) {
      console.warn(" Please select a valid place!");
      return;
    }

    if (!this.id) {
      console.error("Error: No driver ID found in session!");
      return;
    }

    const parkingId = this.selectedParking.id;
    const placeId = `${parkingId}_${this.selectedBloc.replace("Bloc ", "B")}_${this.selectedEtage.replace("Étage ", "E")}_${this.selectedAile.replace("Aile ", "")}_${this.selectedPlace.replace("Place ", "P")}`;

    const reservationData = {
      place: placeId,
      dateDebut: this.dataService.getDateDebut(),
      dateFin: this.dataService.getDateFin(),
      conducteur: this.id,
      facture: 0
    };

    console.log("Reservation Confirmed:", reservationData);

    this.reservationService.addReservation(reservationData).subscribe({
      next: (response) => {
        console.log("Reservation successful:", response);
        this.reservationId = response.id;

        this.simulerPaiement(this.reservationId);
      },
      error: (err) => {
        console.error("Error making reservation:", err);
      }
    });

    this.cancelNotification();
  }


}

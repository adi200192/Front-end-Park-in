import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReservationService } from '../../services/reservation.service';
import { DataService } from '../../services/data.service';
import { PlaceService } from '../../services/place.service';
import {ReservationRequest} from '../../model/reservationRequest';

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
  ) {}


  ngOnInit() {
    this.id = sessionStorage.getItem('userId'); // ✅ Get driver ID
    console.log("📌 ID du conducteur récupéré:", this.id);

    this.route.queryParams.subscribe(params => {
      this.dateFin = params['dateFin'] || null;
      this.selectedParking = {
        id: params['id'],
        imageUrl: params['imageUrl'],
        nom: params['nom'],
        tarif: params['tarif'],
        adresse: params['adresse'],
        url: params['url'],
        dateDebut: params['dateDebut'],
        dateFin: params['dateFin']
      };
    });

    this.getPlacesDisponibles();
  }

  /** 🔥 Fetch places from API instead of using mock data */
  getPlacesDisponibles() {
    const placeRequest = {
      parkingId: this.selectedParking.id,
      typePlace: this.dataService.getType(),
      pmr: this.dataService.getPmr(),
      dateDebut: this.dataService.getDateDebut(),
      dateFin: this.dataService.getDateFin()
    };

    console.log("🔄 Requesting places with:", placeRequest);

    this.placeService.getPlacesDisponibles(placeRequest).subscribe({
      next: (places) => {
        console.log('✅ Places received:', places);
        this.processPlaces(places);
      },
      error: (err) => {
        console.error('❌ Error fetching places:', err);
      }
    });
  }

  /** 🔥 Parses and structures API response */
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

    console.log("📌 Updated Structured Data:", this.structuredData);
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
    console.error(`❌ Invalid ID format: ${placeId}`);
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

  getRandomItem(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }


  bookParking() {
    // 🔹 Vérifier si l'utilisateur est connecté
    this.authService.getUser().subscribe(user => {
      if (!user) {
        console.warn("🚨 Utilisateur non connecté !");
        this.openDialog("⚠️ Vous devez être connecté pour réserver un parking.");

        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        return;
      }

  confirmSelection() {
    if (!this.selectedBloc || !this.selectedEtage || !this.selectedAile || !this.selectedPlace) {
      console.warn("⚠️ Please select a valid place!");
      return;
    }


    if (!this.id) {
      console.error("❌ Error: No driver ID found in session!");
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

    console.log("✅ Reservation Confirmed:", reservationData);




  openDialog(message: string): void {
    this.dialog.open(DialogContentComponent, { data: { message } });
  }
}


@Component({
  selector: 'dialog-content',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmation</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>OK</button>
    </mat-dialog-actions>
  `,
})
export class DialogContentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}

    this.reservationService.addReservation(reservationData).subscribe({next: (response) => {
        console.log("🎉 Reservation successful:", response);
      },
      error: (err) => {
        console.error("Error making reservation:", err);
      }})
  }
}


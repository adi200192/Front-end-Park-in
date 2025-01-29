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
  id : string | null = null;

  structuredData: any = {}; // Stores places grouped by Bloc -> Étage -> Aile
  blocs: string[] = [];
  etages: string[] = [];
  ailes: string[] = [];
  places: string[] = [];

  selectedBloc: string = '';
  selectedEtage: string = '';
  selectedAile: string = '';
  selectedPlace: string = '';

  autoAssign: boolean = false;

  mockPlaces = [
    { id: "06027-P-002_B1_E1_AA_P441", type: "ELECTRIQUE", pmr: false },
    { id: "06027-P-002_B1_E1_AA_P442", type: "ELECTRIQUE", pmr: false },
    { id: "06027-P-002_B1_E2_BB_P443", type: "STANDARD", pmr: false },
    { id: "06027-P-002_B1_E2_BB_P444", type: "STANDARD", pmr: true },
    { id: "06027-P-002_B2_E1_CC_P445", type: "ELECTRIQUE", pmr: false },
    { id: "06027-P-002_B2_E2_CC_P446", type: "STANDARD", pmr: true },
    { id: "06027-P-002_B3_E1_AA_P441", type: "ELECTRIQUE", pmr: false },

  ];

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

      this.id = sessionStorage.getItem('userId');
    });

    this.loadMockData(); // Loads and structures the mock data
  }

  loadMockData() {
    this.structuredData = {};
    this.blocs = [];

    this.mockPlaces.forEach(place => {
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

    console.log("📌 Blocs:", this.blocs);
    console.log("📌 Structured Data:", this.structuredData);
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
    console.error(`Format invalide pour l'ID: ${placeId}`);
    return null;
  }

  onBlocChange() {
    if (!this.selectedBloc || !this.structuredData[this.selectedBloc]) {
      this.etages = [];
      this.selectedEtage = '';
      this.selectedAile = '';
      this.selectedPlace = '';
      this.ailes = [];
      this.places = [];
      return;
    }

    this.etages = Object.keys(this.structuredData[this.selectedBloc]);
    console.log("Etages disponibles:", this.etages);

    this.selectedEtage = '';
    this.selectedAile = '';
    this.selectedPlace = '';
    this.ailes = [];
    this.places = [];
  }


  onEtageChange() {
    if (!this.selectedBloc || !this.selectedEtage || !this.structuredData[this.selectedBloc][this.selectedEtage]) {
      this.ailes = [];
      this.selectedAile = '';
      this.selectedPlace = '';
      this.places = [];
      return;
    }

    // Get available wings (ailes) for the selected floor
    this.ailes = Object.keys(this.structuredData[this.selectedBloc][this.selectedEtage]);
    console.log("Ailes disponibles:", this.ailes);

    this.selectedAile = '';
    this.selectedPlace = '';
    this.places = [];
  }

  onAileChange() {
    if (!this.selectedBloc || !this.selectedEtage || !this.selectedAile || !this.structuredData[this.selectedBloc][this.selectedEtage][this.selectedAile]) {
      this.places = [];
      this.selectedPlace = '';
      return;
    }

    // Get available places for the selected aile
    this.places = this.structuredData[this.selectedBloc][this.selectedEtage][this.selectedAile];
    console.log("Places disponibles:", this.places);

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

  confirmSelection() {
    if (!this.selectedBloc || !this.selectedEtage || !this.selectedAile || !this.selectedPlace) {
      console.warn("⚠️ Veuillez sélectionner une place valide !");
      return;
    }

    const parkingId = this.mockPlaces.length > 0 ? this.mockPlaces[0].id.split("_")[0] : "UNKNOWN";

    const placeId = `${parkingId}_${this.selectedBloc.replace("Bloc ", "B")}_${this.selectedEtage.replace("Étage ", "E")}_${this.selectedAile.replace("Aile ", "")}_${this.selectedPlace.replace("Place ", "P")}`;

    // Création de l'objet de réservation
    const reservationData = {
      place: placeId,  // L'ID formaté de la place
      parking: this.selectedParking.nom,
      dateDebut: this.dataService.getDateDebut(),
      dateFin: this.dataService.getDateFin(),
      conducteur : this.id
    };

    console.log("✅ Réservation Confirmée :", reservationData);
  }

}

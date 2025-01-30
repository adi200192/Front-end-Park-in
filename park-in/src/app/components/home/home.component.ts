import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { ApiService } from '../../services/api.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ParkingRequest } from '../../model/parkingRequest';
import { ParkingService } from '../../services/parking.service';
import { DataService } from '../../services/data.service';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatTimepickerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: []
})
export class HomeComponent implements AfterViewInit {
  searchForm: FormGroup;
  formSubmitted: boolean = false;
  ListeParking: boolean = false;

  isLoading = false;

  minDate: Date = new Date();

  @ViewChild('autoCompleteInput') autoCompleteInput!: ElementRef;

  typePlaces = [
    {label: 'Deux roues', value: 'DEUX_ROUES'},
    {label: 'Deux roues électriques', value: 'DEUX_ROUES_ELECTRIQUE'},
    {label: 'Electrique', value: 'ELECTRIQUE'},
    {label: 'Standard', value: 'STANDARD'},
    {label: 'Vélo', value: 'VELO'}
  ];

  typeParkings = [
    {label: 'Enclos en surface', value: 'enclos_en_surface'},
    {label: 'Ouvrage', value: 'ouvrage'}
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private parkingService: ParkingService,
    private dataService: DataService
  ) {
    this.searchForm = new FormGroup({

      location: new FormControl('', Validators.required),
      dateDebut: new FormControl(null, Validators.required),
      timeDebut: new FormControl('', Validators.required), // ✅ Correction ici (initialisation correcte)
      latitude: new FormControl(null),
      longitude: new FormControl(null),
      dateFin: new FormControl(null, Validators.required),
      timeFin: new FormControl('', Validators.required), // ✅ Correction ici
      pmr: new FormControl(false),
      type: new FormControl('STANDARD'),
      typeOuvrage: new FormControl('ouvrage'),
      hauteur: new FormControl(1.90)
    });
  }

  autocomplete: google.maps.places.Autocomplete | undefined;

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(this.autoCompleteInput.nativeElement, {
      componentRestrictions: {country: 'fr'}
    });

    this.autoCompleteInput.nativeElement.setAttribute('placeholder', 'Saisissez votre adresse');
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      if (place) {
        this.testGeocoding(place.formatted_address);
      }
    });
  }

  testGeocoding(testAddress: any) {
    this.apiService.getCoordinates(testAddress).subscribe(
      (response) => {
        const {lat, lng} = response.results[0].geometry.location;
        console.log(response);
        this.searchForm.patchValue({
          latitude: lat,
          longitude: lng
        });
        console.log(this.searchForm.value);
      },
      (error) => {
        console.error('Error calling Geocoding API:', error);
      }
    );
  }

  combineDateAndTime(date:any, time:any):string{
    if (!date || !time) {
      console.error("❌ Erreur: date ou time invalide", {date, time});
      return '';
    }

    let dateTime = new Date(date);

    if (typeof time === 'string') {
      const [hours, minutes] = time.split(':').map(Number);
      dateTime.setHours(hours, minutes, 0);
    } else if (time instanceof Date) {
      dateTime.setHours(time.getHours(), time.getMinutes(), 0);
    } else {
      console.error("❌ Erreur: format d'heure non reconnu", time);
      return '';
    }

    // ✅ Nouvelle correction : Convertir en chaîne sans perte de fuseau horaire
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Mois commence à 0
    const day = dateTime.getDate().toString().padStart(2, '0');
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    const seconds = dateTime.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  async onSearch() {

    if (this.searchForm.valid) {
      this.formSubmitted = true;
      const dateDebut = this.combineDateAndTime(
        this.searchForm.get('dateDebut')?.value,
        this.searchForm.get('timeDebut')?.value
      );
      const dateFin = this.combineDateAndTime(
        this.searchForm.get('dateFin')?.value,
        this.searchForm.get('timeFin')?.value
      );

      const parkingRequest: ParkingRequest = {
        latitude: this.searchForm.get('latitude')?.value,
        longitude: this.searchForm.get('longitude')?.value,
        dateDebut: dateDebut,
        dateFin: dateFin,
        pmr: this.searchForm.get('pmr')?.value,
        type: this.searchForm.get('type')?.value,
        hauteur: this.searchForm.get('hauteur')?.value,
        typeOuvrage: this.searchForm.get('typeOuvrage')?.value
      };

      console.log('Search ParkingRequest:', parkingRequest);

      // Appel du service API pour récupérer les parkings disponibles
      this.parkingService.getAvailableParking(parkingRequest).subscribe({
        next: (result) => {
          console.log('Search results:', result);
          this.dataService.setType(parkingRequest.type)
          this.dataService.setPmr(parkingRequest.pmr)
          this.dataService.setMessage(result);
          this.dataService.setDateDebut(new Date(this.searchForm.get('dateDebut')?.value).toISOString());
          this.dataService.setDateFin(new Date(this.searchForm.get('dateFin')?.value).toISOString());
          if (result.length == 0) {
            this.ListeParking = true;
          } else {
            this.router.navigate(['/search'], {

              queryParams: {
                dateDebut: parkingRequest.dateDebut,
                dateFin: parkingRequest.dateFin
              }
            });
          }

        },
        error: (err) => {
          console.error('Error fetching parking data', err);
        }
      });
      this.isLoading = true;

      console.log("🔍 Vérification des valeurs du formulaire avant validation :", this.searchForm.value);


      if (this.searchForm.invalid) {
        console.error('⚠️ Formulaire invalide :', this.searchForm.errors);
        return;
      }

      this.formSubmitted = true;

      console.log("📌 Valeur actuelle de time:", this.searchForm.get('timeDebut')?.value);


      // const parkingRequest: ParkingRequest = {
      //   latitude: this.searchForm.get('latitude')?.value,
      //   longitude: this.searchForm.get('longitude')?.value,
      //   dateDebut: dateDebut,
      //   dateFin: dateFin,
      //   pmr: this.searchForm.get('pmr')?.value,
      //   type: this.searchForm.get('type')?.value,
      //   hauteur: this.searchForm.get('hauteur')?.value,
      //   typeOuvrage: this.searchForm.get('typeOuvrage')?.value
      // };

      console.log('✅ Demande de recherche envoyée :', parkingRequest);

      this.parkingService.getAvailableParking(parkingRequest).subscribe({
        next: (result) => {
          this.isLoading = false;
          console.log('🚀 Résultats de la recherche :', result);
          this.dataService.setType(parkingRequest.type);
          this.dataService.setPmr(parkingRequest.pmr);
          this.dataService.setMessage(result);
          this.dataService.setDateDebut(parkingRequest.dateDebut);
          this.dataService.setDateFin(parkingRequest.dateFin);
          this.router.navigate(['/search'], {
            queryParams: {
              dateDebut: parkingRequest.dateDebut,
              dateFin: parkingRequest.dateFin
            }
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('❌ Erreur lors de la récupération des parkings :', err);
        }
      });
    }


  }
}
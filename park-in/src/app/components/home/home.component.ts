import { Component } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import {MessageModule} from 'primeng/message';
import {DropdownModule} from 'primeng/dropdown';
import {MatFormField, MatLabel, MatSelect} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {PrimeNGConfig} from 'primeng/api';
import {ApiService} from '../../services/api.service';


@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,  // Use only ReactiveFormsModule
    CalendarModule,
    CheckboxModule,
    MessageModule,
    DropdownModule,
    MatSelect,
    MatLabel,
    MatOptionModule,
    MatFormField
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  providers: []
})

export class HomeComponent {
  searchForm: FormGroup;
  formSubmitted: boolean = false;
  coordinates: { lat: number; lng: number } | null = null;
  typePlaces = [
    {label : 'Deux roues', value: 'deux_roues'},
    {label : 'Deux roues électriques', value : 'deux_roues_electrique' },
    {label : 'Electrique', value: 'electrique'},
    {label : 'Standard', value : 'standard'}
  ]


  typeParkings = [
    {label : 'Enclos en surface', valeur : 'enclos_en_surface'},
    {label : 'Ouvrage', valeur : 'ouvrage'}
  ]
  constructor(private primengConfig : PrimeNGConfig, private apiService : ApiService) {
    this.searchForm = new FormGroup({
      location: new FormControl('', Validators.required),
      dateDebut: new FormControl(null, Validators.required),
      dateFin: new FormControl(null, Validators.required),
      isPmr: new FormControl(false),
      typePlace : new FormControl('standard'),
      typeParking : new FormControl()
    });

    this.primengConfig.setTranslation({
      firstDayOfWeek: 1,
      dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
      monthNames: [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ],
      monthNamesShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
      today: "Aujourd'hui",
      clear: "Effacer",
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sem'
    });
  }

  testGeocoding(testAddress : any) {
    // const testAddress = 'Paris';

    this.apiService.getCoordinates(testAddress).subscribe(
      (response) => {
        // console.log('Geocoding API Response:', response);
        this.searchForm.get('location')?.setValue(response);
        console.log(this.searchForm.value)
      },
      (error) => {
        console.error('Error calling Geocoding API:', error);
      }
    );
  }
  async onSearch() {
    this.formSubmitted = true
    this.testGeocoding(this.searchForm.get('location')?.value)
    // if (this.searchForm.valid) {
    //   console.log('Search Info:', this.searchForm.value);
    // } else {
    //   console.log('Form is invalid!');
    // }
  }

}

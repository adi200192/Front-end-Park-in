import {AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
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
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {PrimeNGConfig} from 'primeng/api';
import {ApiService} from '../../services/api.service';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatButtonModule} from '@angular/material/button';


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
    MatDatepickerModule,
    MatTimepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelect,
    MatLabel,
    MatInputModule,
    MatOptionModule,
    MatFormField
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  providers: []
})

export class HomeComponent implements AfterViewInit{
  searchForm: FormGroup;
  formSubmitted: boolean = false;

  @ViewChild('autoCompleteInput') autoCompleteInput!:ElementRef

  typePlaces = [
    {label : 'Deux roues', value: 'deux_roues'},
    {label : 'Deux roues électriques', value : 'deux_roues_electrique' },
    {label : 'Electrique', value: 'electrique'},
    {label : 'Standard', value : 'standard'}
  ]

  typeParkings = [
    {label : 'Enclos en surface', value : 'enclos_en_surface'},
    {label : 'Ouvrage', value : 'ouvrage'}
  ]
  constructor(private primengConfig : PrimeNGConfig, private apiService : ApiService) {
    this.searchForm = new FormGroup({
      location: new FormControl('', Validators.required),
      dateDebut: new FormControl(null, Validators.required),
      latitude: new FormControl(null),
      longitude: new FormControl(null),
      dateFin: new FormControl(null, Validators.required),
      isPmr: new FormControl(false),
      typePlace : new FormControl('standard'),
      typeParking : new FormControl('enclos_en_surface'),
      hauteur : new FormControl()
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
 autocomplete : google.maps.places.Autocomplete | undefined
  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(this.autoCompleteInput.nativeElement);

    this.autocomplete.addListener('place_changed', ()=> {
      const place = this.autocomplete?.getPlace();
      console.log(place);
    })

  }

  testGeocoding(testAddress : any) {
    this.apiService.getCoordinates(testAddress).subscribe(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        this.searchForm.patchValue({
          latitude: lat,
          longitude: lng
        });
        // this.searchForm.removeControl('location');
        console.log(this.searchForm.value)
      },
      (error) => {
        console.error('Error calling Geocoding API:', error);
      }
    );
  }
  async onSearch() {
    if (this.searchForm.valid) {
      this.formSubmitted = true
      this.testGeocoding(this.searchForm.get('location')?.value)
    } else {
      console.log('Form is invalid!');
    }
  }

}

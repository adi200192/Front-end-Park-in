import {AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {MatFormField, MatLabel, MatSelect} from '@angular/material/select';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {ApiService} from '../../services/api.service';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatButtonModule} from '@angular/material/button';
import {Router} from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ReactiveFormsModule,  // Use only ReactiveFormsModule
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
    {label : 'Deux roues', value: 'DEUX_ROUES'},
    {label : 'Deux roues électriques', value : 'DEUX_ROUES_ELECTRIQUE' },
    {label : 'Electrique', value: 'ELECTRIQUE'},
    {label : 'Standard', value : 'STANDARD'},
    {label : 'Vélo', value : 'VELO'}
  ]

  typeParkings = [
    {label : 'Enclos en surface', value : 'ENCLOS_EN_SURFACE'},
    {label : 'Ouvrage', value : 'TYPE_OUVRAGE'}
  ]
  constructor(private apiService : ApiService, private router : Router) {
    this.searchForm = new FormGroup({
      location: new FormControl('', Validators.required),
      dateDebut: new FormControl(null, Validators.required),
      latitude: new FormControl(null),
      longitude: new FormControl(null),
      dateFin: new FormControl(null, Validators.required),
      pmr: new FormControl(false),
      type : new FormControl('STANDARD'),
      typeOuvrage : new FormControl('ENCLOS_EN_SURFACE'),
      hauteur : new FormControl(1.90)
    });

  }
 autocomplete : google.maps.places.Autocomplete | undefined
  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(this.autoCompleteInput.nativeElement, { componentRestrictions: { country: 'fr' }});

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
      this.searchForm.patchValue({
        dateDebut: new Date(this.searchForm.get('dateDebut')?.value).toISOString(),
        dateFin: new Date(this.searchForm.get('dateFin')?.value).toISOString()
      });
      this.testGeocoding(this.searchForm.get('location')?.value)
      console.log(this.searchForm.value)
      this.router.navigate(['/search'])
    } else {
      console.log('Form is invalid!');
    }
  }

}

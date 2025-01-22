import { Component } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import localeFr from '@angular/common/locales/fr';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import {MessageModule} from 'primeng/message';
import {DropdownModule} from 'primeng/dropdown';
import {MatFormField, MatLabel, MatOption, MatSelect} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';

registerLocaleData(localeFr);

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
  typePlaces = [
    {label : 'Deux roues', value: 'deux_roues'},
    {label : 'Deux roues électriques', value : 'deux_roues_electrique' },
    {label : 'Electrique', value: 'electrique'},
    {label : 'Standard', value : 'standard'}
  ]

  typeParking = [
    {label : 'Enclos en surface', valeur : 'enclos_en_surface'},
    {label : 'Ouvrage', valeur : 'ouvrage'}
  ]
  constructor() {
    this.searchForm = new FormGroup({
      location: new FormControl('', Validators.required),
      dateDebut: new FormControl(null, Validators.required),
      dateFin: new FormControl(null, Validators.required),
      isPmr: new FormControl(false),
      typePlace : new FormControl('standard')
    });
  }

  onSearch() {
    this.formSubmitted = true
    if (this.searchForm.valid) {
      console.log('Search Info:', this.searchForm.value);
    } else {
      console.log('Form is invalid!');
    }
  }
}

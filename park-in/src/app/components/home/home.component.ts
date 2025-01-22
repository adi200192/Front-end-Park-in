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
    DropdownModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  providers: []
})

export class HomeComponent {
  searchForm: FormGroup;
  formSubmitted: boolean = false;

  constructor() {
    this.searchForm = new FormGroup({
      location: new FormControl('', Validators.required),
      dateDebut: new FormControl(null, Validators.required),
      dateFin: new FormControl(null, Validators.required),
      isPmr: new FormControl(false),
      typeVehicule : new FormControl('')
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

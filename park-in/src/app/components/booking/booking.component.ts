import { Component,OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MatInputModule} from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormField, MatLabel, MatSelect} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
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
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit{
  selectedParking: any;
  etages = ['1er étage', '2ème étage', '3ème étage'];
  blocs = ['Bloc A', 'Bloc B', 'Bloc C'];
  ailes = ['Aile 1', 'Aile 2', 'Aile 3'];


  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedParking = {
        imageUrl: params['imageUrl'],
        nom: params['nom'],
        tarif: params['tarif'],
        adresse: params['adresse'],
        url: params['url'],
      };

      // Log the received data to the console to verify if it's being passed correctly
      console.log('Received parking data:', this.selectedParking);
    });
  }

}

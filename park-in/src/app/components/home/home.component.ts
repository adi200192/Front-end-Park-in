import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,          
    MatDatepickerModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatNativeDateModule,
    FormsModule,
    MatTimepickerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent { 
  location: string = '';
  dateDebut: Date | null = null;
  dateFin: Date | null = null;

  onSearch() {
    console.log('Lieu de stationnement:', this.location);
    console.log('Date de début:', this.dateDebut);
    console.log('Date de fin:', this.dateFin);
}
}


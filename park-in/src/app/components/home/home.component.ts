import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule} from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';


registerLocaleData(localeFr);

@Component({
    selector: 'app-home',
    imports: [
        CommonModule,
        MatDatepickerModule,
        MatInputModule,
        MatFormFieldModule,
        MatNativeDateModule,
        FormsModule,
        MatTimepickerModule,
        MatIconModule,
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [
      { provide: LOCALE_ID, useValue: 'fr-FR' } 
    ]
})


export class HomeComponent { 
  location: string = '';
  Debut: Date | null = null;
  Fin: Date | null = null;

  onSearch() {
    console.log('Lieu de stationnement:', this.location);
    console.log('Date de début:', this.Debut);
    console.log('Date de fin:', this.Fin);
}
}


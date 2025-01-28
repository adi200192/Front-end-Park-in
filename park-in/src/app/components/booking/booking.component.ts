import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
  etages = ['1er étage', '2ème étage', '3ème étage'];
  blocs = ['Bloc A', 'Bloc B', 'Bloc C'];
  ailes = ['Aile 1', 'Aile 2', 'Aile 3'];

  selectedEtage: string = '';
  selectedBloc: string = '';
  selectedAile: string = '';
  autoAssign: boolean = false;

  availability: string = 'Disponible';

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedParking = {
        imageUrl: params['imageUrl'],
        nom: params['nom'],
        tarif: params['tarif'],
        adresse: params['adresse'],
        url: params['url'],
      };
    });
  }

  handleAutoAssign() {
    if (this.autoAssign) {
      this.selectedEtage = this.getRandomItem(this.etages);
      this.selectedBloc = this.getRandomItem(this.blocs);
      this.selectedAile = this.getRandomItem(this.ailes);
    } else {
      this.selectedEtage = '';
      this.selectedBloc = '';
      this.selectedAile = '';
    }
  }
  
  /**
   * Retourne un élément aléatoire d'un tableau donné.
   * @param array Le tableau d'options possibles.
   * @returns Un élément aléatoire du tableau.
   */
  getRandomItem(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }

  bookParking() {
    if (!this.autoAssign && (!this.selectedEtage || !this.selectedBloc || !this.selectedAile)) {
      this.openDialog("Veuillez sélectionner toutes les options pour réserver.");
      return;
    }

    // Définir l'heure actuelle
    const now = new Date();

    // Durée du stationnement (exemple : 1 heure)
    const durationInMinutes = 60;
    const endTime = new Date(now.getTime() + durationInMinutes * 60000);

    // Programmer la notification 10 minutes avant la fin
    const notificationTime = new Date(endTime.getTime() - 10 * 60000);
    const timeUntilNotification = notificationTime.getTime() - now.getTime();

    console.log(`Notification programmée dans ${timeUntilNotification / 1000} secondes`);

    setTimeout(() => {
      this.authService.getUser().subscribe(user => {
        if (user) {
          this.authService.sendWebNotification("🚗 Votre stationnement se termine bientôt !");
        }
      });
    }, timeUntilNotification);

    this.openDialog(`✅ Votre réservation est confirmée pour ${this.selectedParking.nom}, ${this.selectedEtage}, ${this.selectedBloc}, ${this.selectedAile}`);
  }

  openDialog(message: string): void {
    this.dialog.open(DialogContentComponent, {
      data: { message }
    });
  }
}

// Component for displaying pop-up message
@Component({
  selector: 'dialog-content',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmation</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>OK</button>
    </mat-dialog-actions>
  `,
})
export class DialogContentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}

import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {ParkingDTO} from '../../model/parkingDTO';
import {ParkingService} from '../../services/parking.service';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{
  parkings : ParkingDTO[] = [];
  // parkings = [
  //   {
  //     imageUrl: 'assets/park1.jpg',
  //     nom : "Parking Neyrpic",
  //     type : "Couvert",
  //     adresse : "Neyrpic 123, Av Ismail",
  //     distance : "20km",
  //     url : "http://realpark.fr/parking/baudoyer.html",
  //     tarif : 4.50,
  //     pmr : true,
  //     hauteur : 1.90
  //   },
  //   {
  //     imageUrl: 'assets/park2.jpg',
  //     nom : "Parking Grand Place",
  //     type : "Ouvert",
  //     adresse : "18 GP, avenue",
  //     url : "http://realpark.fr/parking/baudoyer.html",
  //     distance : "10km",
  //     tarif : 4.50,
  //     pmr : false,
  //     hauteur : 250
  //   },
  //
  //   {
  //     imageUrl: 'assets/park3.png',
  //     nom: "Parking Central Station",
  //     type: "Couvert",
  //     adresse: "45 Rue de la Gare, 75001 Paris",
  //     url : "http://realpark.fr/parking/baudoyer.html",
  //     distance: "5km",
  //     tarif: 6.00,
  //     pmr: true,
  //     hauteur: 2.00
  //   },
  //   {
  //     imageUrl: 'assets/park1.jpg',
  //     nom: "Parking Villeurbanne",
  //     type: "Extérieur",
  //     adresse: "Place Wilson, 69100 Villeurbanne",
  //     distance: "8km",
  //     tarif: 5.00,
  //     pmr: false,
  //     hauteur: 2.20
  //   },
  //   {
  //     imageUrl: 'assets/park2.jpg',
  //     nom: "Parking Nice Étoile",
  //     type: "Couvert",
  //     adresse: "12 Avenue Jean Médecin, 06000 Nice",
  //     distance: "2km",
  //     tarif: 7.00,
  //     pmr: true,
  //     hauteur: 1.80
  //   }
  // ]
  receivedMessage: string = '';
 constructor(private router : Router, private dataService : DataService) {
 }

  ngOnInit(): void {
    this.parkings = this.dataService.getMessage();

    if (this.parkings.length === 0) {
      console.warn('No parking data found, using mock data');
    } else {
      console.log('Received parking data:', this.parkings);
    }
  }

  // search(parking: ParkingDTO) {
  //   this.router.navigate(['/booking'], {
  //     queryParams: {
  //       imageUrl: parking.imageUrl,
  //       nom: parking.nom,
  //       tarif: parking.tarif,
  //       adresse: parking.adresse,
  //       url : parking.url,
  //     }
  //   });
  // }

}

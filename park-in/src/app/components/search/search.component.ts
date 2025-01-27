import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { ParkingDTO } from '../../model/parkingDTO';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  // parkings: ParkingDTO[] = [];
  parkings = [
    {
      imageUrl: 'assets/park1.jpg',
      nom : "Parking Neyrpic",
      type : "Couvert",
      adresse : "Neyrpic 123, Av Ismail",
      distance : "20km",
      url : "http://realpark.fr/parking/baudoyer.html",
      tarif : 4.50,
      pmr : true,
      hauteur : 1.90
    },
    {
      imageUrl: 'assets/park2.jpg',
      nom : "Parking Grand Place",
      type : "Ouvert",
      adresse : "18 GP, avenue",
      url : "http://realpark.fr/parking/baudoyer.html",
      distance : "10km",
      tarif : 4.50,
      pmr : false,
      hauteur : 250
    },

    {
      imageUrl: 'assets/park3.png',
      nom: "Parking Central Station",
      type: "Couvert",
      adresse: "45 Rue de la Gare, 75001 Paris",
      url : "http://realpark.fr/parking/baudoyer.html",
      distance: "5km",
      tarif: 6.00,
      pmr: true,
      hauteur: 2.00
    },
    {
      imageUrl: 'assets/park1.jpg',
      nom: "Parking Villeurbanne",
      type: "Extérieur",
      adresse: "Place Wilson, 69100 Villeurbanne",
      distance: "8km",
      tarif: 5.00,
      pmr: false,
      hauteur: 2.20
    },
    {
      imageUrl: 'assets/park2.jpg',
      nom: "Parking Nice Étoile",
      type: "Couvert",
      adresse: "12 Avenue Jean Médecin, 06000 Nice",
      distance: "2km",
      tarif: 7.00,
      pmr: true,
      hauteur: 1.80
    }
  ];
  //
  constructor(private router: Router,private route : ActivatedRoute) {}
  //
  ngOnInit() {
  //   // Retrieve navigation state
  //   const navigation = this.router.getCurrentNavigation();
  //   console.log(navigation?.extras.state);
  //   if (navigation?.extras?.state && navigation.extras.state['results']) {
  //     const rawResults = navigation.extras.state['results'];
  //
  //     // Filter and extract only the required properties for ParkingDTO
  //     this.parkings = rawResults.map((result: any) => ({
  //       id: result.id,
  //       name: result.name,
  //       address: result.address,
  //       lat: result.lat,
  //       lng: result.lng,
  //       nbPlaces: result.nbPlaces,
  //       distance: result.distance,
  //       typeOuvrage: result.typeOuvrage,
  //       hauteurMax: result.hauteurMax,
  //       nbPmr: result.nbPmr,
  //       tarif1h: result.tarif1h,
  //       url: result.url,
  //       imageUrl : 'assets/park1.jpg'
  //     }));
  //
  //     console.log('Filtered parking data:', this.parkings);
  //   } else {
  //     console.warn('No parking data found, using mock data');
  //   }

  }



  search(parking: ParkingDTO) {
    this.router.navigate(['/booking'], {
      queryParams: {
        id: parking.id,
        name: parking.name,
        tarif: parking.tarif1h,
        address: parking.address,
        url: parking.url,
      }
    });
  }
}

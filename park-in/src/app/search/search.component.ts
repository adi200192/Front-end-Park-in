import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  parkings = [
    {
      imageUrl: 'assets/park1.jpg',
      nom : "Parking Neyrpic",
      type : "Couvert",
      adresse : "Neyrpic 123, Av Ismail",
      distance : "20km",
      tarif : 4.50,
      pmr : true,
      hauteur : 1.90
    },
    {
      imageUrl: 'assets/park2.jpg',
      nom : "Parking Grand Place",
      type : "Ouvert",
      adresse : "18 GP, avenue",
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
  ]

}

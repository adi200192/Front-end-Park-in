import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ParkingDTO } from '../../model/parkingDTO';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  parkings: ParkingDTO[] = [];
  dateFin: string | null = null;
  imagePaths: string[] = [
    'assets/park.jpg',
    'assets/park1.jpg',
    'assets/park2.jpg',
    'assets/park3.png'
  ];

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService) {}

  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.imagePaths.length);
    return this.imagePaths[randomIndex];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.dateFin = params['dateFin'] || null;
      console.log('📌 DateFin reçue dans SearchComponent:', this.dateFin);

      this.parkings = this.dataService.getMessage();

      if (this.parkings.length === 0) {
        console.warn('❌ Aucun parking disponible');
      } else {
        console.log('📌 Parkings disponibles:', this.parkings);
        this.parkings = this.parkings.map(parking => ({
          ...parking,
          imageUrl: this.getRandomImage(),
          distance: parseFloat((parking.distance * 1000).toFixed(2))
        }));
      }
    });
  }

  search(parking: ParkingDTO) {
    this.router.navigate(['/booking'], {
      queryParams: {
        imageUrl: parking.imageUrl,
        nom: parking.name,
        tarif: parking.tarif1h,
        adresse: parking.address,
        url: parking.url,
        dateFin: this.dateFin // 🔹 On envoie `dateFin` à BookingComponent.
      }
    });
  }
}
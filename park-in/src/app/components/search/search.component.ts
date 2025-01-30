
import {Component, OnInit} from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {ParkingDTO} from '../../model/parkingDTO';
import parkingsData from './parkings.json'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MapComponent } from '../map/map.component';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule,MapComponent,MatProgressSpinnerModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  parkings: ParkingDTO[] = [];
  dateFin: string | null = null;
  isLoading = false;

  dateDebut : string | null = null;
  imagePaths: string[] =
    [
      'assets/park.jpg',
      'assets/park1.jpg',
      'assets/park2.jpg',
      'assets/park3.png'
    ]


  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.imagePaths.length);
    return this.imagePaths[randomIndex];
  }

  constructor(private router: Router, private route : ActivatedRoute, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.queryParams.subscribe(params => {
      this.dateFin = params['dateFin'] || null;
      this.dateDebut = params['dateDebut'] || null;})

    this.parkings = this.dataService.getMessage();

    if (this.parkings.length === 0) {
      this.isLoading = false;
      console.warn('No parking data found');
      this.router.navigate(['/**']);
    } else {
      this.isLoading = false;
      console.log('Received parking data:', this.parkings);
    }

    this.parkings = this.parkings.map(parking => {
    return {
      ...parking,
      imageUrl: this.getRandomImage(),
     distance : parseFloat((parking.distance * 1000).toFixed(2))
    };
  })
 //this.loadParkingsFromJson();
    console.log(this.parkings)
}
loadParkingsFromJson() {
  try {

    this.parkings = parkingsData.map(parking => ({
      ...parking,
      imageUrl: this.getRandomImage(),
      distance: parseFloat((parking.distance * 1000).toFixed(2))
    }));
    console.log('Loaded parkings:', this.parkings);
  } catch (error) {
    console.error('Error loading parkings:', error);
    this.parkings = [];
  }
}
search(parking: ParkingDTO) {
  this.router.navigate(['/booking'], {
    queryParams: {
      id : parking.id,
      imageUrl: parking.imageUrl,
      dateFin : this.dateFin,
      dateDebut : this.dateDebut,
      nom: parking.name,
      tarif1h: parking.tarif1h,
      tarif2h : parking.tarif2h,
      tarif3h : parking.tarif3h,
      tarif4h : parking.tarif4h,
      tarif24h : parking.tarif24h,
      adresse: parking.address,
      url : parking.url,
    }
  });
}

}


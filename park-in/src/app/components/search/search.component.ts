
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {ParkingDTO} from '../../model/parkingDTO';



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
    this.route.queryParams.subscribe(params => {
      this.dateFin = params['dateFin'] || null;
      this.dateDebut = params['dateDebut'] || null;})

    this.parkings = this.dataService.getMessage();

    if (this.parkings.length === 0) {
      console.warn('No parking data found');
    } else {
      console.log('Received parking data:', this.parkings);
    }

    this.parkings = this.parkings.map(parking => {
    return {
      ...parking,
      imageUrl: this.getRandomImage(),
     distance : parseFloat((parking.distance * 1000).toFixed(2))
    };
  })
    console.log(this.parkings)
}

search(parking: ParkingDTO) {
  this.router.navigate(['/booking'], {
    queryParams: {
      id : parking.id,
      imageUrl: parking.imageUrl,
      dateFin : this.dateFin,
      dateDebut : this.dateDebut,
      nom: parking.name,
      tarif: parking.tarif1h,
      adresse: parking.address,
      url : parking.url,
    }
  });
}


}
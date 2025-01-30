import { Component, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ParkingDTO } from '../../model/parkingDTO';
import * as L from 'leaflet';
import { Icon } from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() parkings: ParkingDTO[] = [];
  private map: any;
  private markerLayer: L.LayerGroup = L.layerGroup();

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map', {
      center: [33.9713, -6.8498],
      zoom: 13,
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.markerLayer.addTo(this.map);
    this.addMarkers();
  }

  private addMarkers(): void {
    if (Array.isArray(this.parkings) && this.map) {
      this.markerLayer.clearLayers()

      const bounds: L.LatLngBoundsExpression = [];
      const customIcon = L.icon({
        iconUrl: 'assets/marker-icon.png', // Replace with the actual image path 7it 3arfinga makaynach hahiya hna dir nichan path dyalha .
        iconSize: [16, 24],
        iconAnchor: [8, 16],
        popupAnchor: [0, -16]
      });
      this.parkings.forEach(parking => {
        if (parking.lat && parking.lng) {
          const marker = L.marker([parking.lat, parking.lng],{ icon:customIcon }).addTo(this.markerLayer);
          L.Icon.Default 
          if (parking.name) {
            marker.bindPopup(parking.name);
          }

          bounds.push([parking.lat, parking.lng]);
        } else {
          console.warn(`Parking ${parking.name} has missing latitude or longitude.`);
        }
      });

      if (bounds.length > 0) {
        this.map.fitBounds(bounds);
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['parkings'] && this.map) {
      this.addMarkers();
    }
  }
}
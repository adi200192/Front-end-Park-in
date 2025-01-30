import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-spot-book",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./spot-book.component.html",
  styleUrls: ["./spot-book.component.css"]
})
export class SpotBookComponent {
  @Input() structuredData: any = {};
  @Output() placeSelected = new EventEmitter<any>();
  
  currentBlocIndex = 0;
  currentEtageIndex = 0;
  currentAileIndex = 0;
  selectedPlace: string | null = null;


  get blocs(): string[] {
    return Object.keys(this.structuredData);
  }

  get currentBloc(): string {
    return this.blocs[this.currentBlocIndex] || '';
  }

  get etages(): string[] {
    return Object.keys(this.structuredData[this.currentBloc] || {});
  }

  get ailes(): string[] {
    return this.etages.length > 0 
      ? Object.keys(this.structuredData[this.currentBloc][this.etages[this.currentEtageIndex]] || {})
      : [];
  }


  nextBloc() {
    if (this.currentBlocIndex < this.blocs.length - 1) {
      this.currentBlocIndex++;
      this.resetChildNavigation();
    }
  }

  previousBloc() {
    if (this.currentBlocIndex > 0) {
      this.currentBlocIndex--;
      this.resetChildNavigation();
    }
  }

  onEtageSelect(index: number) {
    this.currentEtageIndex = index;
    this.currentAileIndex = 0;
  }

  selectPlace(bloc: string, etage: string, aile: string, place: string) {
    this.selectedPlace = place;
    const placeData = {
      bloc,
      etage,
      aile,
      place,
      fullId: `${this.formatId(bloc)}_${this.formatId(etage)}_${this.formatId(aile)}_${place.replace('Place ', 'P')}`
    };
    this.placeSelected.emit(placeData);
  }

  private resetChildNavigation() {
    this.currentEtageIndex = 0;
    this.currentAileIndex = 0;
    this.selectedPlace = null;
  }

  private formatId(text: string): string {
    return text.replace(' ', '').replace('É', 'E');
  }

  getPlaces(etage: string, aile: string): string[] {
    return this.structuredData[this.currentBloc]?.[etage]?.[aile] || [];
  }

  trackByFloor(index: number, item: string): string {
    return item;
  }

  trackByAile(index: number, item: string): string {
    return item;
  }
}
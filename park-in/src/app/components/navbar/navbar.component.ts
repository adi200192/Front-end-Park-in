import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router) {}

  Mesresa(){
    this.router.navigate(['/cancel'])
  }

  Seconnecter(){
    this.router.navigate(['/login'])
  }
  Sinscrire(){
    this.router.navigate(["/register"])
  }
  Accueil(){
    this.router.navigate(["/"])
  }
}

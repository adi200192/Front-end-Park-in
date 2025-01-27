import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Auth, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user: User | null = null;

  constructor(private router: Router, private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });
  }

  Mesresa() {
    this.router.navigate(['/cancel']);
  }

  Seconnecter() {
    this.router.navigate(['/login']);
  }

  Sinscrire() {
    this.router.navigate(['/register']);
  }

  Accueil() {
    this.router.navigate(['/']);
  }

  async SeDeconnecter() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erreur de déconnexion', error);
    }
  }
}

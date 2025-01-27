import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule  
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  connexion: FormGroup;
  backgroundImage: string = 'assets/park.jpg'; 

  constructor(
    @Inject(Auth) private auth: Auth, 
    private router: Router
  ) {
    this.connexion = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      mdp: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  async Seconnecter() {
    if (this.connexion.valid) {
      const { email, mdp } = this.connexion.value;
      try {
        await signInWithEmailAndPassword(this.auth, email, mdp);
        alert('Connexion réussie !');
        this.router.navigate(['/']);
      } catch (error: any) {
        alert('Erreur lors de la connexion: ' + error.message);
      }
    } else {
      alert('Veuillez remplir tous les champs correctement.');
    }
  }

  Sinscrire() {
    this.router.navigate(["/register"]);
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('Utilisateur connecté:', result.user);
      alert('Connexion réussie avec Google !');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Erreur Google:', error);
    }
  }

  async signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('Utilisateur connecté:', result.user);
      alert('Connexion réussie avec Facebook !');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Erreur Facebook:', error);
    }
  }
}

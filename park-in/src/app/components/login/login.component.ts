import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,        // Assurez-vous que ce module est bien ajouté ici
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  connexion: FormGroup;

  constructor(
    @Inject(Auth) private auth: Auth, 
    private router: Router,
    private authService: AuthService
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
        const userCredential = await signInWithEmailAndPassword(this.auth, email, mdp);
        const user = userCredential.user;
        this.authService.sendUserDataToBackend(user.uid).subscribe({
          next: (response) => {
            alert('Connexion réussie !');
            this.router.navigate(['/']);
          },
          error: (error) => {
            alert('Erreur lors de l\'envoi des données au backend: ' + error.message);
          }
        });

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
      const user = result.user;
      if (user) {
        this.authService.sendUserDataToBackend(user.uid);
        alert('Connexion réussie avec Google !');
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      console.error('Erreur Google:', error.message);
    }
  }

  async signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      if (user) {
        this.authService.sendUserDataToBackend(user.uid);
        alert('Connexion réussie avec Facebook !');
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      console.error('Erreur Facebook:', error.message);
    }
  }
}

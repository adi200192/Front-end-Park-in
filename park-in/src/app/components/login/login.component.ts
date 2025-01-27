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
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

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
    CommonModule,
    HttpClientModule  
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  connexion: FormGroup;
  backgroundImage: string = 'assets/park.jpg'; 

  constructor(
    @Inject(Auth) private auth: Auth, 
    private router: Router,
    private http: HttpClient,
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

      this.http.post('http://localhost:2200/conducteur/connexion', { uid: user.uid })
        .subscribe(response => {
          console.log('Connexion Google backend:', response);
          alert('Connexion réussie avec Google !');
          this.router.navigate(['/']);
        });

    } catch (error) {
      console.error('Erreur Google:', error);
    }
  }

  async signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      this.http.post('http://localhost:2200/connexion', { uid: user.uid })
        .subscribe(response => {
          console.log('Connexion Facebook backend:', response);
          alert('Connexion réussie avec Facebook !');
          this.router.navigate(['/']);
        });

    } catch (error) {
      console.error('Erreur Facebook:', error);
    }
  }
}

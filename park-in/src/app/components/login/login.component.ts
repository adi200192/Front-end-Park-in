import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Auth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';

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

  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private auth: Auth) {}

  // Connexion via Google
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('Utilisateur connecté:', result.user);
      alert('Connexion réussie avec Google !');
    } catch (error) {
      console.error('Erreur Google:', error);
    }
  }

  // Connexion via Facebook
  async signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('Utilisateur connecté:', result.user);
      alert('Connexion réussie avec Facebook !');
    } catch (error) {
      console.error('Erreur Facebook:', error);
    }
  }

  onSubmit() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}

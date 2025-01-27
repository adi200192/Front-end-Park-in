import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  inscription: FormGroup;

  constructor(
      @Inject(Auth) private auth: Auth, 
      private router: Router
  ){
    this.inscription = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  async Sinscrire() {
    if (this.inscription.valid) {
      const { email, password } = this.inscription.value;
      try {
        await createUserWithEmailAndPassword(this.auth, email, password);
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        this.router.navigate(['/login']);
      } catch (error: any) {
        alert(`Erreur lors de l'inscription : ${error.message}`);
      }
    }
  }

  async signUpWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('Utilisateur inscrit avec Google:', result.user);
      alert('Inscription réussie avec Google !');
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Erreur Google:', error.message);
    }
  }

  async signUpWithFacebook() {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('Utilisateur inscrit avec Facebook:', result.user);
      alert('Inscription réussie avec Facebook !');
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Erreur Facebook:', error.message);
    }
  }

  Seconnecter() {
    this.router.navigate(['/login']);
  }
}

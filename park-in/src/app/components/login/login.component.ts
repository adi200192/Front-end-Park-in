import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { CommonModule } from '@angular/common'; // Ajout de CommonModule
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
    CommonModule  // Ajout ici pour permettre l'utilisation de ngStyle
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  backgroundImage: string = 'assets/park.jpg'; 
  connexion : FormGroup;// Assurez-vous que l'image est dans "src/assets/"



  constructor(
    @Inject(Auth) private auth: Auth, 
    private router: Router
  ) {
this.connexion = new FormGroup({
  email:new FormControl('', Validators.required),
  mdp:new FormControl('', Validators.required)
})
  }

  Seconnecter(){
    if(this.connexion.valid)
    {
      this.router.navigate(['/'])
    }
  }
  Sinscrire(){
    this.router.navigate(["/register"])
  }

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

import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importation pour ngStyle
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule  // Ajout pour activer ngStyle dans le template
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  backgroundImage: string = 'assets/park.jpg'; // Chemin de l'image de fond
  inscription : FormGroup;
  
  constructor(
      @Inject(Auth) private auth: Auth, 
      private router: Router
    ){
      this.inscription = new FormGroup({
        name:new FormControl('', Validators.required),
        email:new FormControl('', Validators.required),
        password:new FormControl('', Validators.required)
      })
    }

    Sinscrire() {
      if(this.inscription.valid)
      {
        this.router.navigate(['/login'])
      }
    console.log('Name:', this.name);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
  Seconnecter(){
    this.router.navigate(["/login"])
  }
}

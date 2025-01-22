import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment'; // Assurez-vous que ce chemin est correct
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()), 
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),  // Initialisation Firebase
    provideAuth(() => getAuth()),
  ]
};

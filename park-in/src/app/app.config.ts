import { ApplicationConfig , provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment'; // Assurez-vous que ce chemin est correct
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withHashLocation()), 
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),  // Initialisation Firebase
    provideAuth(() => getAuth()),
    provideHttpClient()
  ]
};

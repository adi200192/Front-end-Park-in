import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr'
import {appConfig} from './app/app.config';
import {provideHttpClient} from '@angular/common/http';
import {MAT_DATE_LOCALE} from '@angular/material/core';

registerLocaleData(localeFr);


bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    ...appConfig.providers
  ]
}).catch(err => console.error(err));



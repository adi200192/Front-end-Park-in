import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CancelComponent } from './components/cancel/cancel.component';
import {BookingComponent} from './components/booking/booking.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'search', component: SearchComponent},
  { path: 'cancel', component: CancelComponent },
  {path: 'booking', component: BookingComponent},
  { path: '**', redirectTo: '' }


];

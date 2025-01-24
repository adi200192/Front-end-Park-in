import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {SearchComponent} from './components/search/search.component';
import {BookingComponent} from './components/booking/booking.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'search', component: SearchComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'booking', component: BookingComponent}
];

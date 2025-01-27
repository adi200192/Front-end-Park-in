import { Injectable, Inject } from '@angular/core';
import { Auth, User, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor(
    @Inject(Auth) private auth: Auth,
    private http: HttpClient
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    const authInstance = getAuth();
    onAuthStateChanged(authInstance, (user) => {
      this.currentUser.next(user ? user : null);
    });
  }

  getUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  logout() {
    this.auth.signOut();
    this.currentUser.next(null);
  }

  sendUserDataToBackend(uid: string): Observable<any> {
    return this.http.post('http://localhost:2200/inscription', { uid });
  }
}

import { Injectable, Inject } from '@angular/core';
import { Auth, User, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  private token: string | null = null;

  constructor(
    @Inject(Auth) private auth: Auth,
    private http: HttpClient
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    const authInstance = getAuth();
    onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        this.currentUser.next(user);
        this.token = await user.getIdToken();
      } else {
        this.currentUser.next(null);
        this.token = null;
      }
    });
  }

  getUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      this.token = await user.getIdToken();
      return this.token;
    }
    return null;
  }

  logout() {
    this.auth.signOut();
    this.currentUser.next(null);
    this.token = null;
  }

  sendUserDataToBackend(uid: string, token: string) {
    const userData = {
      uid: uid,
      token: token
    };
  
    this.http.post('http://localhost:2200/inscription', userData)
      .subscribe({
        next: (response) => {
          console.log('UID et token envoyés au backend avec succès:', response);
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi des données au backend:", error);
        }
      });
  }
  
}

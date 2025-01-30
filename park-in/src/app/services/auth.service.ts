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
      this.currentUser.next(user || null);
    });
  }

  getUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  logout() {
    this.auth.signOut();
    this.currentUser.next(null);
  }

  /**
   * Envoie l'UID de l'utilisateur au backend
   * @param uid Identifiant unique Firebase de l'utilisateur
   * @returns Observable pour gérer la réponse du serveur
   */
  sendUserDataToBackend(id: string, abonne: boolean): Observable<any> {
    return this.http.post('http://localhost:2200/conducteur/inscription', { id, abonne });
}


  sendUserDataToBackendConnexion(id: string): Observable<any> {
    return this.http.post('http://localhost:2200/conducteur/connexion', { id });
  }

  sendWebNotification(message: string) {
    if (!("Notification" in window)) {
      console.error("Ce navigateur ne supporte pas les notifications.");
      return;
    }
  
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("🚗 Park-In Notification", {
          body: message,
          icon: "assets/logo.png" // Remplace par le chemin du logo
        });
      }
    });
  }
  }



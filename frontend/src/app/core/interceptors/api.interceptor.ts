import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.activeRequests++;
    this.showLoader();

    // Récupérer le token depuis le localStorage (si authentifié)
    const token = localStorage.getItem('auth_token');

    // Cloner la requête et ajouter les headers
    let modifiedRequest = request;
    if (token) {
      modifiedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Gestion des différents types d'erreurs
        if (error.status === 401) {
          // Non autorisé - rediriger vers la page de connexion
          localStorage.removeItem('auth_token');
          this.router.navigate(['/auth/login']);
          this.snackBar.open('Session expirée. Veuillez vous reconnecter.', 'OK', {
            duration: 5000
          });
        } else if (error.status === 403) {
          // Interdit - l'utilisateur n'a pas les permissions nécessaires
          this.snackBar.open('Vous n\'avez pas les autorisations nécessaires pour effectuer cette action.', 'OK', {
            duration: 5000
          });
        } else if (error.status === 404) {
          // Ressource non trouvée
          this.snackBar.open('La ressource demandée n\'existe pas.', 'OK', {
            duration: 5000
          });
        } else if (error.status === 500) {
          // Erreur serveur
          this.snackBar.open('Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.', 'OK', {
            duration: 5000
          });
        } else {
          // Autres erreurs
          this.snackBar.open('Une erreur s\'est produite. Veuillez réessayer.', 'OK', {
            duration: 5000
          });
        }
        return throwError(() => error);
      }),
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.hideLoader();
        }
      })
    );
  }

  private showLoader(): void {
    // Implémentation d'un indicateur de chargement global
    // Par exemple, déclencher un service de loader ou modifier un état
    document.body.classList.add('api-loading');
  }

  private hideLoader(): void {
    // Masquer l'indicateur de chargement
    document.body.classList.remove('api-loading');
  }
}

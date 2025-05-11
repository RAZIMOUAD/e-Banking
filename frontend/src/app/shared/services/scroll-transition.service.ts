// ✅ scroll-transition.service.ts
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollTransitionService {
  private scrollPosition$ = new BehaviorSubject<number>(0);

  constructor(private zone: NgZone) {
    this.zone.runOutsideAngular(() => {
      fromEvent(window, 'scroll')
        .pipe(throttleTime(100))
        .subscribe(() => {
          const y = window.scrollY;
          this.zone.run(() => this.scrollPosition$.next(y));
        });
    });
  }

  /**
   * Observable à utiliser dans les composants pour suivre la position Y
   */
  getScrollY(): Observable<number> {
    return this.scrollPosition$.asObservable();
  }

  /**
   * Lire la valeur actuelle synchroniquement
   */
  get currentScrollY(): number {
    return this.scrollPosition$.value;
  }

  /**
   * Vérifie si un seuil est dépassé
   */
  hasScrolledBeyond(threshold: number): boolean {
    return this.scrollPosition$.value > threshold;
  }
}

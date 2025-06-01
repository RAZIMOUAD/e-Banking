import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiInterceptor } from './api.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

describe('ApiInterceptor', () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    const interceptor = TestBed.inject(HTTP_INTERCEPTORS).find(
      (i: any) => i instanceof ApiInterceptor
    );
    expect(interceptor).toBeTruthy();
  });
});

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { mergeMap, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly auth: AngularFireAuth) {}

  intercept = (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> =>
    this.auth.idToken.pipe(
      mergeMap((token) =>
        next.handle(
          token
            ? request.clone({
                setHeaders: { Authorization: `Bearer ${token}` },
              })
            : request
        )
      )
    );
}

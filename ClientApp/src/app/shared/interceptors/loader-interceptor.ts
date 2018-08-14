// src/app/auth/jwt.interceptor.ts
// ...
import 'rxjs/add/operator/do';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from '../../services/loader/loader.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(public loader: LoaderService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
        this.loader.pop(request.url);
      } else {
        this.loader.push(request.url);
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          // No Auth
          // redirect to the login route
          // or show a modal
          this.loader.pop(request.url);
        }
        if (err.status === 403) {
          // Not allowed
          this.loader.pop(request.url);
        }
        if (err.status === 500){
        // internal server error
          this.loader.pop(request.url);
        }
      }
    });
  }
}

import 'rxjs/add/operator/do';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {AuthService} from '../services/auth/AuthService';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

export class JwtInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService, public router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigate(['/welcome']);
          // redirect to the login route
          // or show a modal
        }
      }
    });
  }
}

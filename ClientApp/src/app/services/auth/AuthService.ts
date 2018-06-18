import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {HttpClient} from "@angular/common/http";
import {Indicator} from "../../shared/models/indicator";
import {IndicatorService} from "../indicator/indicator.service";
import {Router} from "@angular/router";


export interface Credentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private static AUTHORIZATION_API = "/api/auth/";

  public auth(credentials: Credentials): Observable<boolean> {
    return Observable.create(observer => {
      // this.checkAuth(credentials).subscribe(
      //   response => {
      //     const user = this.newUser(response);
      //     localStorage.setItem('user', user);
      //     observer.next(true);
      //     observer.complete();
      //   },
      //   err => {
      //     observer.error(err);
      //     observer.complete();
      //   }
      // );
      return this.http.post<any>(AuthService.AUTHORIZATION_API, credentials).subscribe(
        (data: any) => {
          // success path
          let token: string = data.token;
          localStorage.setItem('token', token);
          observer.next(true);
          localStorage.setItem('user', JSON.stringify(credentials));
          observer.complete();
          this.router.navigate(['/home']);

        },
        error => {
          // error path
          localStorage.setItem('token', null);
          localStorage.setItem('user', null);
          this.router.navigate(['/welcome']);
          observer.error(new Error('usuario inválido'));
          observer.complete();
        }
      );
    });
  }

  public signOut() {
    return Observable.create(observer => {
      localStorage.removeItem('user');
      observer.next(true);
      observer.complete();
    });
  }

  public getUser() : Credentials | boolean {
    const object = JSON.parse(localStorage.getItem('user'));
    if (object == null) {
      return false;
    }
    return JSON.parse(localStorage.getItem('user'));
  }
  
  public getToken() : String | boolean {
    let token: string = JSON.parse(localStorage.getItem('token'));
    if (token == null) {
      return false;
    }
    return token;
  }

  private parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  public newUser(response) {
    const token = response.headers.get('Authorization');
    const user = this.parseJwt(token);
    return JSON.stringify({
      user: user.sub,
      secure: {
        token: token
      }
    });
  }
}

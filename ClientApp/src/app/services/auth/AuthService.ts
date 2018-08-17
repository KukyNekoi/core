import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../alerts/notification.service';
import { PermissionClaim } from './permissions';
import { User } from './User';
import { Role } from '../../shared/models/role';

export interface Credentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router, private notifications: NotificationService) {
  }

  private static AUTHORIZATION_API = '/api/auth/';
  private static ROLE_API = '/api/Roles/';
  private self_token = null;
  private role: Role = null;

  public auth(credentials: Credentials): Observable<boolean> {
    return Observable.create(observer => {
      return this.http.post<any>(AuthService.AUTHORIZATION_API, credentials).subscribe(
        (data: any) => {
          // success path
          const token: string = data.token;
          localStorage.setItem('token', token);
          observer.next(true);
          observer.complete();
          this.router.navigate(['/home']);
          this.notifications.showToaster('Sesión iniciada', 'success');
          this.self_token = this.getToken();
          this.loadRole();


        },
        error => {
          // error path
          localStorage.setItem('token', null);
          this.router.navigate(['/welcome']);
          this.self_token = null;
          observer.error(new Error('usuario inválido'));
          this.notifications.showToaster('Usuario inválido', 'error');
          observer.complete();
        }
      );
    });
  }

  private loadRole() {
    this.http.get<Role>(AuthService.ROLE_API + (this.getUser() as User).role_ids).subscribe(data => {
      this.role = data;
    });
  }

  /*
  // came with this idea while listening https://www.youtube.com/watch?v=4NrJ1C4sKr8 and drinking some vodka <3
  public isAllowedTo(target: PermissionTarget, claim: PermissionClaim): boolean {
    const token = <any>this.getToken();
    if (token.reads && claim === PermissionClaim.READ) {
      return token.reads.indexOf(target) > -1;
    } else if (token.writes && claim === PermissionClaim.WRITE) {
      return token.writes.indexOf(target) > -1;
    }
    return false;
  }
  */

  // came with this idea while sober <3
  public isAllowedTo(indicatorId: number, claim: PermissionClaim): boolean {
    if (claim === PermissionClaim.WRITE) {
      for (const permission of  this.role.permissionsWrite) {
        if (permission.indicatorID === indicatorId) {
          return true;
        }
      }
      return false;
    } else {
      for (const permission of this.role.permissionsRead) {
        if (permission.indicatorID === indicatorId) {
          return true;
        }
      }
      return false;
    }
  }

  public roleIsAllowedTo(roleId: string, indicatorId: number, claim: PermissionClaim): Observable<Role> {
    return this.http.get<Role>(AuthService.ROLE_API + roleId);
  }


  public signOut() {
    return Observable.create(observer => {
      localStorage.removeItem('token');
      observer.next(true);
      observer.complete();
      this.notifications.showToaster('Sesión finalizada', 'info');
      this.self_token = null;
      this.role = null;
    });
  }

  public getRole(): Role {
    if (this.role === null) { // If load ins't loaded...
      // Load role
      this.http.get<Role>(AuthService.ROLE_API + (this.getUser() as User).role_ids).subscribe(data => {
        this.role = data;
      },
        error => { // If cannot obtain the role, close the session
          this.signOut();
          localStorage.setItem('token', null);
          this.router.navigate(['/welcome']);
          this.self_token = null;
          this.notifications.showToaster('La sesión se ha cerrado', 'error');
        },
        () => { // Returns on subscribe completed
          return this.role;
        });
    } else {
      return this.role;
    }
  }

  public getUser(): User | boolean {
    const user: any = this.getToken();
    if (user !== false) {
      return user;
    }
    return false;
  }

  public getToken(): String | boolean {
    const raw_token = this.getRawToken();
    if (typeof raw_token !== 'string') {
      return false;
    }
    const secure_token: string = this.parseJwt(raw_token);
    if (secure_token == null) {
      return false;
    }
    return secure_token;
  }

  public getRawToken(): String | boolean {
    const raw_token = localStorage.getItem('token');
    if (!raw_token || raw_token === 'null') {
      return false;
    } else {
      return raw_token;
    }
  }

  private parseJwt(raw_token: string) {
    let base64Url: string;
    base64Url = (raw_token + '').split('.')[1];
    let base64: string;
    base64 = (base64Url + '').replace('-', '+');
    base64 = (base64 + '').replace('_', '/');
    return JSON.parse((<any>window).atob(base64 + ''));
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

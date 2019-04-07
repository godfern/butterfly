import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {RegistrationService} from "../../services/registration.service";

@Injectable()
export class AuthServiceProvider {

  static readonly LOGIN_URL = 'http://localhost:3000/butterfly-user-srv/user/e011d010-26e9-11e9-b971-ad9612dbcabf';
  static readonly REGISTER_URL = 'http://localhost:3000/butterfly-srv/user/create';
  access: boolean;
  token: string;
  registrationDetails: string;
  registerSubmit: Observable<any>;

  constructor(private httpClient : Http) { }

  // Login
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials.");
    } else {
      return Observable.create(observer => {

        this.httpClient.get(AuthServiceProvider.LOGIN_URL, credentials)
          .map(res => res.json())
          .subscribe(data => {
            if (data.access_token) {
              this.token = 'Bearer ' + data.access_token;
              this.access = true;
            } else {
              this.access = false;
            }
          });

        setTimeout(() => {
          observer.next(this.access);
        }, 500);

        setTimeout(() => {
          observer.complete();
        }, 1000);


      }, err => console.error(err));
    }
  }

  // Register
  public register(credentials): Observable<RegistrationService[]> {
    return this.httpClient
      .post(AuthServiceProvider.REGISTER_URL, credentials)
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throw(error.statusText);
}

  // Get Token
  public getToken() {
    return this.token;
  }

  // Logout
  public logout() {
    return Observable.create(observer => {
      observer.next(true);
      observer.complete();
    });
  }

}
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { OAuthService } from 'angular-oauth2-oidc';
import { RegistrationService } from "../../services/registration.service";

@Injectable()
export class AuthServiceProvider {

  static readonly LOGIN_URL = 'http://localhost:3000/butterfly-srv/user/login';
  static readonly REGISTER_URL = 'http://localhost:3000/butterfly-srv/user/create';
  access: boolean;
  token: string;
  registrationDetails: string;
  registerSubmit: Observable<any>;

  constructor(private httpClient: Http, private oauthService: OAuthService) { }

  // Login
  public login(credentials) {
    if (credentials.emailId === null || credentials.password === null) {
      return Observable.throw("Please insert credentials.");
    } else {
      return this.httpClient
        .post(AuthServiceProvider.LOGIN_URL, credentials)
        .map((response) => {
          return response.json();
        })
        .catch(this.handleError);
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

  getAll(): Observable<any> {
    const headers: Headers = new Headers();
    headers.append('Authorization', this.oauthService.authorizationHeader());

    let options = new RequestOptions({ headers: headers });

    return this.httpClient.get('http://localhost:8100/good-beers', options)
      .map((response: Response) => response.json());
  }

  // Logout
  public logout() {
    return Observable.create(observer => {
      observer.next(true);
      observer.complete();
    });
  }
}
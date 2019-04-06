import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthServiceProvider {
  
  // Change to this http://ed43bb3b.ngrok.io/api/login
  static readonly LOGIN_URL = 'http://localhost:3000/butterfly-user-srv/user/e011d010-26e9-11e9-b971-ad9612dbcabf';
  // Change to this http://ed43bb3b.ngrok.io/api/register
  static readonly REGISTER_URL = 'http://localhost:3000/butterfly-user-srv/user/create';
  access: boolean;
  token: string;

  constructor(public http: Http) {}

  // Login
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials.");
    } else {
      return Observable.create(observer => {

        this.http.get(AuthServiceProvider.LOGIN_URL, credentials)
        .map(res => res.json())
        .subscribe( data => {
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
  public register(credentials) {
    if (credentials.name === null || credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {

        this.http.post(AuthServiceProvider.REGISTER_URL, credentials)
        .map(res => res.json())
        .subscribe( data => {
          console.log(data);
        });

        observer.next(true);
        observer.complete();
      });
    }
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
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Http, RequestOptions, Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users;

  constructor(private nav: NavController, private auth: AuthServiceProvider, public http:Http) {
    this.getUsers();
  }

  public getUsers() {
    let headers = new Headers(
    {
      'Authorization' : this.auth.getToken()
    });

    let options = new RequestOptions({ headers: headers });
    // Change to this http://ed43bb3b.ngrok.io/api/users
    let url = 'http://contoh.dev/api/users';
    this.http.get(url, options).map(res => res.json()).subscribe(
      data => {
        this.users = data.data;
      }
    );
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.nav.setRoot('LoginPage')
    });
  }

}
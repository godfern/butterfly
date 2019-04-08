import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users;

  constructor(private nav: NavController, private auth: AuthServiceProvider, public http: Http) { }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.nav.setRoot('LoginPage')
    });
  }

}
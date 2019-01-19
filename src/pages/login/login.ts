import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { OAuthService } from 'angular-oauth2-oidc';
// declare const OktaAuth: any;

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
  })
  export class LoginPage {
    @ViewChild('email') email: any;
    private username: string;
    private password: string;
    private error: string;
  
    constructor(private navCtrl: NavController/*, private oauthService: OAuthService*/) {
    //   oauthService.redirectUri = window.location.origin;
    //   oauthService.clientId = '[client-id]';
    //   oauthService.scope = 'openid profile email';
    //   oauthService.oidc = true;
    //   oauthService.issuer = 'https://dev-[dev-id].oktapreview.com';
    }
  
    ionViewDidLoad(): void {
      setTimeout(() => {
        this.email.setFocus();
      }, 500);
    }
  }
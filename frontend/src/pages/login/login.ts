import { Component, ViewChild } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { IonicPage, NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

declare const OktaAuth: any;

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild('email') email: any;
  private username: string;
  private password: string;
  private error: string;
  loading: Loading;
  registerCredentials = { email: '', password: '' };

  constructor(
    public nav: NavController,
    private auth: AuthServiceProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private oauthService: OAuthService
  ) {
    oauthService.redirectUri = window.location.origin;
    oauthService.clientId = '0oaj0x38utIXGkfCg0h7';
    oauthService.scope = 'openid profile email';
    oauthService.oidc = true;
    oauthService.issuer = 'https://dev-835945.oktapreview.com';
  }

  ionViewDidLoad(): void {
    setTimeout(() => {
      this.email.setFocus();
    }, 500);
  }

  public createAccount() {
    this.nav.push('RegisterPage');
  }

  public login() {
    this.oauthService.createAndSaveNonce().then(nonce => {
      const authClient = new OktaAuth({
        clientId: this.oauthService.clientId,
        redirectUri: this.oauthService.redirectUri,
        url: this.oauthService.issuer
      });
      authClient.signIn({
        username: this.username,
        password: this.password
      }).then((response) => {
        if (response.status === 'SUCCESS') {
          authClient.token.getWithoutPrompt({
            nonce: nonce,
            responseType: ['id_token', 'token'],
            sessionToken: response.sessionToken,
            scopes: this.oauthService.scope.split(' ')
          })
            .then((tokens) => {
              // oauthService.processIdToken doesn't set an access token
              // set it manually so oauthService.authorizationHeader() works
              localStorage.setItem('access_token', tokens[1].accessToken);
              this.oauthService.processIdToken(tokens[0].idToken, tokens[1].accessToken);
              this.nav.push('HomePage');
            })
            .catch(error => console.error(error));
        } else {
          throw new Error('We cannot handle the ' + response.status + ' status');
        }
      }).fail((error) => {
        console.error(error);
        this.error = error.message;
      });
    });
  }

  // public login() {
  //   this.showLoading()
  //   this.auth.login(this.registerCredentials).subscribe(allowed => {
  //     if (allowed) {
  //       this.nav.setRoot(HomePage);
  //     } else {
  //       this.showError("These credentials do not match our records.");
  //     }
  //   },
  //     error => {
  //       this.showError(error);
  //     });
  // }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    // alert.present(prompt);
  }


}
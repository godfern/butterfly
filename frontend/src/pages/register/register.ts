import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  createSuccess = false;
  registerCredentials = { locale: "en_IN", firstName: '', emailId: '', password: '', confirmation_password: '', primaryType: "EMAIL", roles: ["USER"] };
  data = '';

  constructor(
    private nav: NavController,
    private auth: AuthServiceProvider,
    private alertCtrl: AlertController
  ) { }

  public register() {
    if (this.registerCredentials.password != this.registerCredentials.confirmation_password) {
      this.showPopup("Error", 'The password confirmation does not match.');
    } else {
      this.auth.register(this.registerCredentials)
        .subscribe(response => {
          if (response) {
            this.createSuccess = true;
            this.data = response;

            this.showPopup("Success", "Account created.");
          } else {
            this.showPopup("Error", response);
          }
        },
          error => {
            this.createSuccess = false;
            this.showPopup("Error", error);
          });
    }
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.push('OtpPage', this.data);
            }
          }
        }
      ]
    });
    alert.present();
  }
}
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import { OTPServiceProvider } from '../../providers/otp-service/otp-service';

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html'
})
export class OtpPage implements OnInit {

  public optVerification: boolean = true;
  verificationDetails = { email: '', name: '', otp: '', id: '', activationId: '' };
  activationId = '';
  countDown;
  counter = 600;
  tick = 1000;
  createSuccess = false;
  data = '';


  constructor(public nav: NavController, public navParams: NavParams, public otp: OTPServiceProvider, private alertCtrl: AlertController) {
    this.verificationDetails.id = navParams.data._id;

    this.countDown = Observable.timer(0, this.tick)
      .take(this.counter)
      .map(() => --this.counter)
  }

  ngOnInit() {
    this.otp.sendOTP(this.verificationDetails)
      .subscribe((response) => {
        console.log(response);
        this.verificationDetails.activationId = response.data.accId;
      },
        error => {
          this.showPopup("Error", error.message);
        });
  }

  public accoutVerify() {
    if (!this.verificationDetails.otp || !this.verificationDetails.id || !this.verificationDetails.activationId) {
      this.showPopup("Error", 'Something went wrong.');
    } else {
      this.otp.verifyOTP(this.verificationDetails).subscribe(success => {
        if (success) {
          this.createSuccess = true;
          this.data = success;

          this.showPopup("Success", "Account Verified.");
        } else {
          this.showPopup("Error", "Problem Verifying account.");
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

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
  }

}
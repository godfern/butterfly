import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html'
})
export class OtpPage {

  public optVerification: boolean = true; 
  verificationDetails = { email: '',name: '', otp: '' };
  countDown;
  counter = 600;
  tick = 1000;

  // ngOnInit() {
  //   this.countDown = Observable.timer(0, this.tick)
  //     .take(this.counter)
  //     .map(() => --this.counter)
  // }

  constructor(public nav: NavController, public navParams: NavParams) {
    this.verificationDetails.email = navParams.get('email');
    this.verificationDetails.name = navParams.get('name');

    this.countDown = Observable.timer(0, this.tick)
      .take(this.counter)
      .map(() => --this.counter)
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

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { RegistrationService } from '../../services/registration.service';


@Injectable()
export class OTPServiceProvider {
    static readonly OTP_URL = 'http://localhost:3000/butterfly-srv/user/initiate/verification';
    access: boolean;
    RegistrationService: RegistrationService[];

    constructor(public http: Http) { }

    //Send OTP
    // public sendOtp(credentials) {
    //     if (!credentials.id) {
    //         console.log("Please insert credentials.");
    //     } else {
    //         return Observable.create(observer => {
    //             this.http.post(OTPServiceProvider.OTP_URL, {userId:credentials.id})
    //                 .map(res => res.json())
    //                 .subscribe(data => {
    //                     console.log('Otp data', data);
    //                     this.access = data;
    //                 });

    //             setTimeout(() => {
    //                 observer.next(this.access);
    //             }, 500);

    //             setTimeout(() => {
    //                 observer.complete();
    //             }, 1000);
    //         }, err => console.error(err));
    //     }
    // }

    sendOTP(credentials): Observable<RegistrationService[]> {
        return this.http.post(OTPServiceProvider.OTP_URL, {userId:credentials.id})
                .map((res)=> res.json())
                
      }
}
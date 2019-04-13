import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { RegistrationService } from '../../services/registration.service';


@Injectable()
export class OTPServiceProvider {
    static readonly SEND_OTP_URL = 'http://localhost:3000/butterfly-srv/user/initiate/verification';
    static readonly VERIFY_OTP_URL = 'http://localhost:3000/butterfly-srv/user/verify/otp';
    access: boolean;
    // RegistrationService: RegistrationService[];

    constructor(public http: Http) { }


    sendOTP(credentials) {
        return this.http.post(OTPServiceProvider.SEND_OTP_URL, { userId: credentials.id })
            .map((res) => res.json())

    }

    verifyOTP(credentials){
        let payload = {
            userId:credentials.id,
            accId:credentials.activationId,
            code:credentials.otp
        };
        return this.http.post(OTPServiceProvider.VERIFY_OTP_URL, payload)
            .map((res) => res.json())
    }


}
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { OtpPage, FormatTimePipe } from './otp';

@NgModule({
  declarations: [
    OtpPage,
    FormatTimePipe
  ],
  imports: [
    IonicPageModule.forChild(OtpPage),
  ]
})
export class OtpPageModule {}

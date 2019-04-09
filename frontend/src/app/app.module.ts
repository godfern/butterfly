import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicModule } from 'ionic-angular';
import { OAuthService, OAuthModule } from 'angular-oauth2-oidc';
import { AppRoutingModule } from './app-routing.module';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { OTPServiceProvider } from '../providers/otp-service/otp-service';
import { MyApp } from './app.component';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    IonicModule.forRoot(MyApp, {})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppRoutingModule,
    AuthServiceProvider,
    OTPServiceProvider,
    OAuthService
  ]
})
export class AppModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: './pages/login/login#LoginPage', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login#LoginPage'},
  { path: 'register', loadChildren: './pages/register/register#RegisterPageModule' },
  { path: 'otp', loadChildren: './pages/otp/otp#OtpPage' },
  { path: 'home', loadChildren: './pages/home/home#HomePageModule', canActivate:[AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
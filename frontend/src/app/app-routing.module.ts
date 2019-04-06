import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { path: '', redirectTo: './pages/login/login#LoginPage', pathMatch: 'full' },
    { path: 'login', loadChildren: './pages/login/login#LoginPage' },
    { path: 'register', loadChildren: './pages/register/register#RegisterPage'  },
    { path: 'otp', loadChildren: './pages/otp/otp#OtpPage'  },
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
  })

  export class AppRoutingModule { }
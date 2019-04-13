import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPage } from './register';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: RegisterPage }
];

@NgModule({
  declarations: [
    RegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterPage),
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    RegisterPage
  ],
  bootstrap: [RegisterPage],
  exports: [RouterModule]
})
export class RegisterPageModule {}

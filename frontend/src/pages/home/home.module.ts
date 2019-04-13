import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', component: HomePage }
];

@NgModule({
    declarations: [HomePage],
    imports: [
        IonicPageModule.forChild(HomePage),
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class HomePageModule { }

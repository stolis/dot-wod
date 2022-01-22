import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginPage } from './login.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { LoginRoutingModule } from './login-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      ExploreContainerComponentModule,
      LoginRoutingModule
    ],
    declarations: [LoginPage],
  })
  export class LoginModule {}
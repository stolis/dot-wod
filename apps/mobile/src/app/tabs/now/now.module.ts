import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiModule } from '@dot-wod/api';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { NowPageRoutingModule } from './now-routing.module';
import { NowPage } from '../now/now.page';

@NgModule({
    imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      ApiModule,
      RoundProgressModule,
      NowPageRoutingModule
    ],
    declarations: [NowPage],
  })
  export class NowPageModule {}

import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiModule } from '@dot-wod/api';
import { HistoryPage } from './history.page';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { HistoryPageRoutingModule } from './history-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ApiModule,
    ExploreContainerComponentModule,
    HistoryPageRoutingModule,
    RoundProgressModule
  ],
  declarations: [HistoryPage],
})
export class HistoryPageModule {}

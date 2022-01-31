import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiModule } from '@dot-wod/api';
import { TodayPage } from './today.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { TodayPageRoutingModule } from './today-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ApiModule,
    ExploreContainerComponentModule,
    TodayPageRoutingModule,
  ],
  declarations: [TodayPage],
})
export class TodayPageModule {}

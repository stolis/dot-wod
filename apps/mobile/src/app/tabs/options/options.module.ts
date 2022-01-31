import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiModule } from '@dot-wod/api';
import { ReactiveFormsModule } from '@angular/forms';
import { OptionsPage } from './options.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { OptionsPageRoutingModule } from './options-routing.module';
import { SchedulesComponent } from './schedules/schedules.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { FormatsComponent } from './formats/formats.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { OptionsDirective } from './options.directive';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApiModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: OptionsPage }]),
    OptionsPageRoutingModule,
  ],
  declarations: [OptionsPage, SchedulesComponent, EquipmentComponent, FormatsComponent, ExercisesComponent, OptionsDirective],
})
export class OptionsPageModule {}

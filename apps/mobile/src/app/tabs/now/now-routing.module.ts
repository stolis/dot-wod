import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NowPage } from './now.page';

const routes: Routes = [
  {
    path: '',
    component: NowPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NowPageRoutingModule {}
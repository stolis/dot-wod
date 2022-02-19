import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '@dot-wod/api';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then((m) => m.LoginModule)
      },
      {
        path: 'today',
        loadChildren: () => import('./today/today.module').then((m) => m.TodayPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'history',
        loadChildren: () => import('./history/history.module').then((m) => m.HistoryPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'options',
        loadChildren: () => import('./options/options.module').then((m) => m.OptionsPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'now',
        loadChildren: () => import('./now/now.module').then((m) => m.NowPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/tabs/login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}

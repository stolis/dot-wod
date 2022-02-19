import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { API_KEY, ENVIRONMENT, GoogleSheetApiService } from '@dot-wod/api';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    }, 
    { 
      provide: ENVIRONMENT, 
      useValue: environment 
    },
    {
      provide: API_KEY,
      useValue: 'AIzaSyDARaWDqi2iC38w0Fb15ZX1Jf_7geLZwrU'
    },
    GoogleSheetApiService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

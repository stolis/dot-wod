import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderService } from './services/provider.service';
import { InArrayPipe } from './pipes/in-array.pipe';

@NgModule({
  imports: [CommonModule],
  providers: [ProviderService],
  declarations: [
    InArrayPipe
  ]
})
export class ApiModule {}

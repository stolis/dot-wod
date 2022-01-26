import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderService } from './services/provider.service';

@NgModule({
  imports: [CommonModule],
  providers: [ProviderService],
  declarations: []
})
export class ApiModule {}

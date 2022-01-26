import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderService } from './services/provider.service';
import { AsTypePipe } from './pipes/as-type.pipe';

@NgModule({
  imports: [CommonModule],
  providers: [ProviderService],
  declarations: [
    AsTypePipe
  ]
})
export class ApiModule {}

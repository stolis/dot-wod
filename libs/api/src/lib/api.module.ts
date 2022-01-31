import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderService } from './services/provider.service';
import { FilterByPipe } from '../lib/pipes/filter-by.pipe';

@NgModule({
  imports: [CommonModule],
  providers: [ProviderService],
  declarations: [FilterByPipe],
  exports: [FilterByPipe]
})
export class ApiModule {}

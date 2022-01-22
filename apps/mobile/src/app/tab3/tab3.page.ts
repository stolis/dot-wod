import { Component } from '@angular/core';
import { ProviderService } from '@dot-wod/api';

@Component({
  selector: 'dot-wod-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  constructor(private provider: ProviderService) {
    
  }
}

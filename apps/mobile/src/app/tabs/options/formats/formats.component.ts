import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ProviderService, DOTWOD_TIMEDIRECTION, IAvailableFormat, FormatService, DOTWOD_LOGBY } from '@dot-wod/api';
import { IonItemSliding, AlertController } from '@ionic/angular';
import { OptionsDirective } from '../options.directive';

@Component({
  selector: 'dot-wod-formats',
  templateUrl: './formats.component.html',
  styleUrls: ['./formats.component.scss']
})
export class FormatsComponent extends OptionsDirective implements OnInit {
  @ViewChildren(IonItemSliding) slides!: QueryList<IonItemSliding>;
  editItem: IAvailableFormat | undefined;
  timeDirections = Object.values(DOTWOD_TIMEDIRECTION);
  logByTypes = Object.values(DOTWOD_LOGBY);

  constructor(public svc: FormatService, public api: ProviderService, public alert: AlertController) { 
    super(svc,api,alert);
  }

  ngOnInit(): void {
  }

  setTimeDirection(event: any) {
    this.editItem!.time_direction = event.detail.value as DOTWOD_TIMEDIRECTION;
  }

  setLogBy(event: any) {
    this.editItem!.log_by = event.detail.value as DOTWOD_LOGBY;
  }

}

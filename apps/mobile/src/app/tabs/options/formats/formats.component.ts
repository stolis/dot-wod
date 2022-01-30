import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ProviderService, DOTWOD_TIMEDIRECTION, IFormat, FormatService } from '@dot-wod/api';
import { IonItemSliding, AlertController } from '@ionic/angular';
import { OptionsDirective } from '../options.directive';

@Component({
  selector: 'dot-wod-formats',
  templateUrl: './formats.component.html',
  styleUrls: ['./formats.component.scss']
})
export class FormatsComponent extends OptionsDirective implements OnInit {
  @ViewChildren(IonItemSliding) slides!: QueryList<IonItemSliding>;
  editItem: IFormat | undefined;
  timeDirections = Object.values(DOTWOD_TIMEDIRECTION);

  constructor(public svc: FormatService, public api: ProviderService, public alert: AlertController) { 
    super(svc,api,alert);
  }

  ngOnInit(): void {
  }

  setTimeDirection(event: any) {
    this.editItem!.time_direction = event.detail.value as DOTWOD_TIMEDIRECTION;
  }

}

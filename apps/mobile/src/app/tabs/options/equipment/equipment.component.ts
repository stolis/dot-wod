import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IAvailableEquipment, EquipmentService, ProviderService } from '@dot-wod/api';
import { IonItemSliding, AlertController } from '@ionic/angular';
import { OptionsDirective } from '../options.directive';

@Component({
  selector: 'dot-wod-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent extends OptionsDirective implements OnInit {
  @ViewChildren(IonItemSliding) slides!: QueryList<IonItemSliding>;
  editItem: IAvailableEquipment | undefined;
  
  constructor(public svc: EquipmentService, public api: ProviderService, public alert: AlertController) { 
    super(svc,api,alert);
  }

  ngOnInit(): void { }

}

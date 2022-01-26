import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProviderService, DOTWOD_CATEGORIES } from '@dot-wod/api';
import { AlertController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'dot-wod-options',
  templateUrl: 'options.page.html',
  styleUrls: ['options.page.scss'],
})
export class OptionsPage implements OnInit {
  editItemFormGroup!: FormGroup;
  editItem: any;
  slidItem!: IonItemSliding;

  categories = DOTWOD_CATEGORIES;
  viewingCategory: DOTWOD_CATEGORIES = DOTWOD_CATEGORIES.SCHEDULES;
  
  constructor(private fb: FormBuilder, public provider: ProviderService, private alert: AlertController) { }

  ngOnInit(): void {
    this.editItemFormGroup = this.fb.group({
      equipment_name: ['',[Validators.required]],
      weight: ['',[Validators.min(0.5),Validators.max(100)]],
      height: ['',[Validators.min(20),Validators.max(500)]]
    })
  }

  toggleCategory(event: any){
    const selectedCategory = event?.detail?.value as DOTWOD_CATEGORIES;
    this.viewingCategory = selectedCategory;
  }
}

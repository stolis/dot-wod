import { Component, OnInit } from '@angular/core';
import { DOTWOD_CATEGORIES, EquipmentService, ScheduleService } from '@dot-wod/api';

@Component({
  selector: 'dot-wod-options',
  templateUrl: 'options.page.html',
  styleUrls: ['options.page.scss'],
})
export class OptionsPage implements OnInit {
  categories = DOTWOD_CATEGORIES;
  viewingCategory: DOTWOD_CATEGORIES = DOTWOD_CATEGORIES.EXERCISES;
  
  constructor() {}

  ngOnInit(): void {}

  toggleCategory(event: any){
    const selectedCategory = event?.detail?.value as DOTWOD_CATEGORIES;
    this.viewingCategory = selectedCategory;
  }
}

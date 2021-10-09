import { Component } from '@angular/core';

@Component({
  selector: 'dot-wod-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  exercises: Array<{ name: string, reps: string, equipment: string}> = [
    { name: "Hang Clean & Jerk", reps: "100", equipment: "2 x Dumbbell (15kg)" },
    { name: "Ring Rows", reps: "7 (penalty)", equipment: "2 x Rings" }
  ]
  constructor() {}
}

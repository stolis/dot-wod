import { Component } from '@angular/core';

@Component({
  selector: 'dot-wod-today',
  templateUrl: 'today.page.html',
  styleUrls: ['today.page.scss'],
})
export class TodayPage {
  wods = [
    {
      id: 171,
      format: 'For Time',
      timecap: 15,
      rounds: 5,
      exercises: [
        {
          name: 'Hang Clean & Jerk',
          reps: '100',
          equipment: '2 x Dumbbell (15kg)',
        },
        { name: 'Ring Rows', reps: '7 (penalty)', equipment: '2 x Rings' },
      ],
    },
    {
      id: 172,
      format: 'Amrap',
      timecap: 15,
      rounds: null,
      exercises: [
        { name: 'Ring Row', reps: '12', equipment: '2 x Rings' },
        { name: 'Air Squat', reps: '12', equipment: null },
        { name: 'Diamond Push Up', reps: '12', equipment: null },
      ],
    },
  ];
  constructor() {}
}

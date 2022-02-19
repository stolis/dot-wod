import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NowPage } from './now.page';

describe('NowPage', () => {
  let component: NowPage;
  let fixture: ComponentFixture<NowPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NowPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

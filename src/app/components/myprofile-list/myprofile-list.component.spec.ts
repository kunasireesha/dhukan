import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyprofileListComponent } from './myprofile-list.component';

describe('MyprofileListComponent', () => {
  let component: MyprofileListComponent;
  let fixture: ComponentFixture<MyprofileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyprofileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyprofileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

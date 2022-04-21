import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVarietyComponent } from './add-variety.component';

describe('AddVarietyComponent', () => {
  let component: AddVarietyComponent;
  let fixture: ComponentFixture<AddVarietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVarietyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVarietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

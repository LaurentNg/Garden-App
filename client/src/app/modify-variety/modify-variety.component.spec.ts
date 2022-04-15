import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyVarietyComponent } from './modify-variety.component';

describe('ModifyVarietyComponent', () => {
  let component: ModifyVarietyComponent;
  let fixture: ComponentFixture<ModifyVarietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyVarietyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyVarietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

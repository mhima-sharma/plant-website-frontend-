import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCaseOfMyProjectComponent } from './show-case-of-my-project.component';

describe('ShowCaseOfMyProjectComponent', () => {
  let component: ShowCaseOfMyProjectComponent;
  let fixture: ComponentFixture<ShowCaseOfMyProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowCaseOfMyProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowCaseOfMyProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

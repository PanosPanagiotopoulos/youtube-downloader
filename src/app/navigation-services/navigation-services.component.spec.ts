import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationServicesComponent } from './navigation-services.component';

describe('NavigationServicesComponent', () => {
  let component: NavigationServicesComponent;
  let fixture: ComponentFixture<NavigationServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

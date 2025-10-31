import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyAppsComponent } from './my-apps.component';

describe('MyAppsComponent', () => {
  let component: MyAppsComponent;
  let fixture: ComponentFixture<MyAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyAppsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openGitHub', () => {
    it('should open a new tab with the given URL', () => {
      const url = 'https://github.com/example';
      const openSpy = spyOn(window, 'open');

      component.openGitHub(url);

      expect(openSpy).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer');
    });

    it('should not call window.open if URL is empty', () => {
      const openSpy = spyOn(window, 'open');

      component.openGitHub('');

      expect(openSpy).not.toHaveBeenCalled();
    });
  });
});

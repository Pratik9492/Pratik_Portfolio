import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder } from '@angular/forms';
import {
  distinctUntilChanged,
  map,
  Observable,
  ReplaySubject,
  scan,
  startWith,
  switchMap,
  takeUntil,
  takeWhile,
} from 'rxjs';
import {
  TRANSITION_TEXT,
  TRANSITION_IMAGE_SCALE,
} from 'src/app/ui/animations/transitions/transitions.constants';
import { UiUtilsView } from 'src/app/ui/utils/views.utils';

@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.component.html',
  styleUrls: ['./my-apps.component.scss'],
  animations: [TRANSITION_TEXT, TRANSITION_IMAGE_SCALE],
})
export class MyAppsComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  mOnceAnimated = false;

  _mTriggerAnim? = 'false';
  _mThreshold = 0.4;

  @ViewChild('animRefView') vAnimRefView?: ElementRef<HTMLElement>;

  constructor(
    public el: ElementRef,
    private _ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    public mediaObserver: MediaObserver,
    private scroll: ScrollDispatcher,
    private viewPortRuler: ViewportRuler,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setupAnimation();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /* **********************************************************************
   *                            ANIMATION LOGIC
   ********************************************************************** */
  public setupAnimation() {
    if (!this.vAnimRefView) return;

    this.scroll
      .ancestorScrolled(this.vAnimRefView, 100)
      .pipe(
        takeUntil(this.destroyed$),
        startWith(0),
        map(() => {
          if (this.vAnimRefView) {
            return UiUtilsView.getVisibility(
              this.vAnimRefView,
              this.viewPortRuler
            );
          }
          return 0;
        }),
        scan<number, boolean>(
          (acc: number | boolean, val: number) =>
            val >= this._mThreshold || (acc ? val > 0 : false)
        ),
        distinctUntilChanged(),
        takeWhile((trigger) => !trigger || !this.mOnceAnimated, true),
        switchMap(
          (trigger) =>
            new Observable<number | boolean>((observer) =>
              this._ngZone.run(() => observer.next(trigger))
            )
        )
      )
      .subscribe((val) => {
        if (!this.mOnceAnimated && val) {
          this.mOnceAnimated = true;
          this._mTriggerAnim = 'true';
          this.cdr.detectChanges();
        }
      });

    // Fallback trigger
    setTimeout(() => {
      if (!this.mOnceAnimated) {
        this._mTriggerAnim = 'true';
        this.cdr.detectChanges();
      }
    }, 800);
  }

  /* **********************************************************************
   *                            APP LIST
   ********************************************************************** */
  _mApps = [
    {
      id: '5131',
      name: 'MovieLens',
      image: 'assets/img/apps/Movie1.png',
      description:
        'A dynamic movie application that showcases the latest releases with real-time updates. Users can explore detailed cast information, ratings, trailers, and synopses, with clear indicators highlighting new films. Built with an intuitive interface for seamless and engaging movie discovery.',
      techStack: ['Angular'],
      github: 'https://github.com/Pratik9492/MovieLens',
    },
  ];
  openGitHub(url: string): void {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

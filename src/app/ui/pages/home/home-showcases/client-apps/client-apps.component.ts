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
  selector: 'app-client-apps',
  templateUrl: './client-apps.component.html',
  styleUrls: ['./client-apps.component.scss'],
  animations: [TRANSITION_TEXT, TRANSITION_IMAGE_SCALE],
})
export class ClientAppsComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  mOnceAnimated = false;

  _mTriggerAnim? = 'false';
  _mThreshold = 0.4;

  @ViewChild('animRefView') vAnimRefView?: ElementRef<HTMLElement>;

  currentImageMap: { [key: string]: string } = {};
  private intervalIds: any[] = [];

  constructor(
    public el: ElementRef,
    private _ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    public mediaObserver: MediaObserver,
    private scroll: ScrollDispatcher,
    private viewPortRuler: ViewportRuler,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // ✅ Set up auto image slider for every project
    this._mClientApps.forEach((app) => {
      this.currentImageMap[app.id] = app.images[0];
      let index = 0;

      const id = setInterval(() => {
        index = (index + 1) % app.images.length;
        this.currentImageMap[app.id] = app.images[index];
        this.cdr.detectChanges();
      }, 3000); // Switch every 3 seconds

      this.intervalIds.push(id);
    });
  }

  ngAfterViewInit(): void {
    this.setupAnimation();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.intervalIds.forEach((id) => clearInterval(id));
  }

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
   *                            PROJECT LIST
   ********************************************************************** */
  _mClientApps = [
    {
      id: '5131',
      name: 'Hardware Data Controlling System',
      images: [
        'assets/img/clients/image1.png',
        'assets/img/clients/image2.png',
      ],
      color: '#FFFFFF',
      description:
        'A high-performance web application built from scratch to manage multiple hardware devices with real-time data tracking. It features robust APIs for seamless IoT communication, concurrent device support, dynamic status monitoring, and interactive data visualization.',
      techStack: ['Angular', 'PrimeNG', 'ASP.NET Core', 'MySQL'],
    },
    {
      id: '5132',
      name: 'Billing System',
      images: [
        'assets/img/clients/Billing1.png',
        'assets/img/clients/Billing2.png',
      ],
      color: '#FFFFFF',
      description:
        'A comprehensive billing system designed to streamline invoicing and payment processes. It includes features such as customer management, invoice generation, payment tracking, and reporting, all built with a user-friendly interface and secure backend.',
      techStack: ['Angular', 'PrimeNG', 'ASP.NET Core', 'MySQL'],
    },
    {
      id: '5133',
      name: 'Feedback System',
      images: [
        'assets/img/clients/feedback1.png',
        'assets/img/clients/feedback2.png',
      ],
      color: '#FFFFFF',
      description:
        'A sophisticated feedback management platform developed from the ground up, featuring secure user authentication, fully customizable feedback forms, and configurable evaluation parameters. The system provides real-time submission tracking, advanced analytics dashboards, and automated notifications, enabling organizations to efficiently collect, monitor, and analyze user feedback for data-driven decision making.',
      techStack: ['Angular', 'PrimeNG', 'ASP.NET Core', 'MySQL'],
    },
  ];
}

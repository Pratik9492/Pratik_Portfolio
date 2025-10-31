import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ReplaySubject, takeUntil, startWith, map, scan, distinctUntilChanged, takeWhile, switchMap, Observable } from 'rxjs';
import { TRANSITION_IMAGE_SCALE, TRANSITION_TEXT } from 'src/app/ui/animations/transitions/transitions.constants';
import { UiUtilsView } from 'src/app/ui/utils/views.utils';

@Component({
  selector: 'app-home-expertise',
  templateUrl: './home-expertise.component.html',
  styleUrls: ['./home-expertise.component.scss'],
  animations: [
    TRANSITION_TEXT,
    TRANSITION_IMAGE_SCALE
  ]
})
export class HomeExpertiseComponent implements OnInit {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  mOnceAnimated = false

  /* ********************************************************************************************
    *                anims
    */
  _mTriggerAnim?= 'false'

  _mTriggerImage?= 'false'


  _mThreshold = 0.2


  @ViewChild('animRefView') vAnimRefView?: ElementRef<HTMLElement>;

  constructor(public el: ElementRef,
    private _ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    public mediaObserver: MediaObserver,
    private scroll: ScrollDispatcher, private viewPortRuler: ViewportRuler) { }

  ngOnInit(): void {
  }



  ngAfterViewInit(): void {
    this.setupAnimation();
  }

  ngOnDestroy(): void {

    this.destroyed$.next(true)
    this.destroyed$.complete()
  }


  public setupAnimation() {
    if (!this.vAnimRefView) return;

    // console.info("home products setupAnimation: " )
    this.scroll.ancestorScrolled(this.vAnimRefView, 100).pipe(
      // Makes sure to dispose on destroy
      takeUntil(this.destroyed$),
      startWith(0),
      map(() => {
        if (this.vAnimRefView != null) {
          var visibility = UiUtilsView.getVisibility(this.vAnimRefView, this.viewPortRuler)
          // console.log("product app-item UiUtilsView visibility: ", visibility)
          return visibility;
        }
        return 0;

      }),
      scan<number, boolean>((acc: number | boolean, val: number) => (val >= this._mThreshold || (acc ? val > 0 : false))),
      // Distincts the resulting triggers 
      distinctUntilChanged(),
      // Stop taking the first on trigger when aosOnce is set
      takeWhile(trigger => { 
        // console.info("app-item  !trigger || !this.mOnceAnimated",
        //   !trigger || !this.mOnceAnimated)

        return !trigger || !this.mOnceAnimated
      }, true),
      switchMap(trigger => new Observable<number | boolean>(observer => this._ngZone.run(() => observer.next(trigger))))
    ).subscribe(val => {


      // console.log("home-item setupAnimation ancestorScrolled: ", val)

      if (this.mOnceAnimated) {
        return;
      }

      if (val) {
        // console.log("HomeProductsComponent setupAnimation setupAnimation ancestorScrolled: ", val)

        this.mOnceAnimated = true
        this._mTriggerAnim = 'true'
        this.cdr.detectChanges()
      }
      // if (this.vImageArea != null) {
      //   var visibility = UiUtilsView.getVisibility(this.vImageArea, this.viewPortRuler)
      //   console.log("UiUtilsView visibility: ", visibility)
      // }
    }

    )
  }

 _mTools = [
  {
    id: '8101',
    name: 'Angular',
    logo: 'assets/img/tools/angular.png',
    link: 'https://angular.io/',
    tab: 'web',
    color: '#DD0031'
  },
  {
    id: '4101',
    name: 'Flutter',
    logo: 'assets/img/tools/flutter_logo.svg',
    link: 'https://flutter.dev/',
    tab: 'cross',
    color: '#42A5F5'
  },
  {
    id: '8102',
    name: 'HTML5',
    logo: 'assets/img/tools/html5.svg',
    link: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    tab: 'web',
    color: '#E44D26'
  },
  {
    id: '8103',
    name: 'CSS3',
    logo: 'assets/img/tools/css3.svg',
    link: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    tab: 'web',
    color: '#1572B6'
  },
  {
    id: '8104',
    name: 'JavaScript',
    logo: 'assets/img/tools/javascript.png',
    link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    tab: 'web',
    color: '#F7DF1E'
  },
  {
    id: '7121',
    name: 'ASP.NET Core',
    logo: 'assets/img/tools/dotnetcore.svg',
    link: 'https://dotnet.microsoft.com/',
    tab: 'back-end',
    color: '#512BD4'
  },
  {
    id: '7122',
    name: 'Java',
    logo: 'assets/img/tools/java-logo.png',
    link: 'https://www.java.com/',
    tab: 'back-end',
    color: '#E76F00'
  },
  {
    id: '7123',
    name: 'MySQL',
    logo: 'assets/img/tools/mysql.svg',
    link: 'https://www.mysql.com/',
    tab: 'back-end',
    color: '#4479A1'
  },
  {
    id: '8105',
    name: 'Sass',
    logo: 'assets/img/tools/sass-logo.svg',
    link: 'https://sass-lang.com/',
    tab: 'web',
    color: '#CF649A'
  },
  {
    id: '9101',
    name: 'Visual Studio Code',
    logo: 'assets/img/tools/vscode.svg',
    link: 'https://code.visualstudio.com/',
    tab: 'tools',
    color: '#007ACC'
  },
  {
    id: '9102',
    name: 'Visual Studio',
    logo: 'assets/img/tools/visual-studio.svg',
    link: 'https://visualstudio.microsoft.com/',
    tab: 'tools',
    color: '#5C2D91'
  }
];

}

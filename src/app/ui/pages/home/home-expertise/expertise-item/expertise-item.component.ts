import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-expertise-item',
  templateUrl: './expertise-item.component.html',
  styleUrls: ['./expertise-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpertiseItemComponent implements OnInit {

  _mParts = '';
  _mJobType = '';
  _mIsColored = false;
  _mColor = '#E94E77'; // default
  _mColorLight = '#F06292'; // default light

  constructor(private cdr: ChangeDetectorRef) {}

  @Input('jobType') set jobType(value: string) {
    if (value) this._mJobType = value;
  }

  @Input('parts') set parts(value: string[]) {
    if (value && value.length > 0) this._mParts = value.join(' | ');
  }

  @Input('isColored') set isColored(value: boolean) {
    this._mIsColored = !!value;
  }

  @Input('color') set color(value: string) {
    if (value) {
      this._mColor = value;
      this._mColorLight = this._getLightVariant(value);
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {}

  private _getLightVariant(hex: string): string {
    // Generate ~20% lighter color for gradient
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * 20);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }
}

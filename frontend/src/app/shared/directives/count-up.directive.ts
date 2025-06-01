// count-up.directive.ts
import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit
} from '@angular/core';
import { CountUp } from 'countup.js';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements AfterViewInit {
  @Input() endVal: number = 0;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const options = {
      duration: 2,
      separator: ',',
      decimal: '.',
    };

    const countUp = new CountUp(this.el.nativeElement, this.endVal, options);

    if (!countUp.error) {
      countUp.start();
    } else {
      console.error('CountUp error:', countUp.error);
    }
  }
}

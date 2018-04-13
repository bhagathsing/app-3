import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: '[onlyNumber]' })
export class OnlyNumber {

  regexStr = '^[0-9]*$';
  constructor(private el: ElementRef) { }

  @Input('onlyNumber') OnlyNumber: boolean;

  @HostListener('keypress', ['$event']) keyPress(event) {
    if (this.OnlyNumber) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
          event.preventDefault();
        }
      }
  }
}
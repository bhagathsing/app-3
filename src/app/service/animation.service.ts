import { trigger, state, style, transition, animate } from '@angular/animations';

export const collapseAnimation = trigger('collapsed', [
  state('true', style({
    height: '*',
    opacity: 1,
    overflow: 'visible'
  })),
  state('false',   style({
    height: '0px',
    opacity: 0,
    overflow: 'hidden'
  })),
  transition('false => true', animate('300ms ease-in')),
  transition('true => false', animate('300ms ease-out'))
]);

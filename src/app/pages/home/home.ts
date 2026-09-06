import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'z-home',
  standalone: true,
  template: ` <p>home works!</p> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}

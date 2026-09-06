import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'z-group-detail',
  imports: [],
  template: ` <p>group-detail works!</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDetail {}

import {
  Component,
  Input,
  HostListener,
  HostBinding,
  Host,
  Inject,
  Optional,
} from '@angular/core';
import { ISelectComponent, SELECT_COMPONENT_TOKEN } from './select.interface';

@Component({
  standalone: true,
  selector: 'app-select-item',
  templateUrl: './select-item.component.html',
  styleUrls: ['./select-item.component.scss'],
})
export class SelectItemComponent {
  @Input()
  value: any;

  @HostBinding('class.selected')
  selected = false;

  constructor(
    @Host()
    @Optional()
    @Inject(SELECT_COMPONENT_TOKEN)
    private parent?: ISelectComponent,
  ) {}

  @HostListener('click')
  click() {
    if (this.parent) {
      this.parent.onSelect(this);
    }
  }
}

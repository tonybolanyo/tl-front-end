import {
  Component,
  Input,
  HostListener,
  HostBinding,
  Host,
  forwardRef,
  Inject,
} from '@angular/core';
import { SelectComponent } from './select.component';

@Component({
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
    @Inject(forwardRef(() => SelectComponent))
    private parent?: SelectComponent,
  ) {}

  @HostListener('click')
  click() {
    if (this.parent) {
      this.parent.onSelect(this);
    }
  }
}

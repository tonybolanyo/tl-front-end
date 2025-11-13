import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { Subject } from 'rxjs';
import { AbstractNgModel } from '../model/abstract-ngmodel';
import { ngModelProvider } from '../model/ng-model-config';
import { SelectItemComponent } from './select-item.component';
import { ISelectComponent, SELECT_COMPONENT_TOKEN } from './select.interface';

@Component({
  standalone: true,
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    ngModelProvider(SelectComponent),
    {
      provide: SELECT_COMPONENT_TOKEN,
      useExisting: SelectComponent,
    },
  ],
  imports: [SelectItemComponent],
})
export class SelectComponent<T = unknown>
  extends AbstractNgModel<T | T[] | undefined>
  implements OnInit, AfterContentInit, ISelectComponent {
  @Input()
  multiple = false;

  /**
   * Only for multiple = true
   */
  @Input()
  max!: number;

  /**
   * Keeps always one selected if you init at first one value. If you don't do
   * it, no value will be initialized at first
   */
  @Input()
  alwaysOneSelected = false;

  @Output()
  change = new EventEmitter<T | T[] | undefined>();

  @ContentChildren(SelectItemComponent)
  children!: QueryList<SelectItemComponent<T>>;

  private modelChecker = new Subject<T | T[] | undefined>();

  ngOnInit(): void {
    if (this.multiple) {
      this.model = [] as T[];
    }
  }

  ngAfterContentInit(): void {
    this.modelChecker.subscribe(() => this.doCheck());
  }

  override writeValue(obj: T | T[] | undefined): void {
    if (this.multiple && !Array.isArray(obj)) {
      this.model = [] as T[];
    } else {
      this.model = obj;
    }
    this.modelChecker.next(this.model);
  }

  doCheck() {
    if (this.multiple) {
      this.children.forEach((child) => {
        child.selected =
          (this.model as T[]).filter((id: T) => child.value === id).length > 0;
      });
    } else {
      if (typeof this.model !== 'undefined') {
        const selectedChild = this.children.find(
          (child) => child.value === this.model,
        );
        if (selectedChild) {
          selectedChild.selected = true;
        }
      }
    }
  }

  onSelect(child: SelectItemComponent<T>) {
    if (this.multiple) {
      const model = this.model as T[];
      const idx = model.indexOf(child.value);
      if (idx >= 0) {
        if (!(this.alwaysOneSelected && model.length === 1)) {
          model.splice(idx, 1);
          child.selected = false;
          this.notify();
        }
      } else {
        if (!this.max || model.length < this.max) {
          model.push(child.value);
          child.selected = true;
          this.notify();
        }
      }
    } else {
      if (this.model === child.value) {
        if (!this.alwaysOneSelected) {
          this.model = undefined;
          child.selected = false;
          this.notify();
        }
      } else {
        this.model = child.value as T;
        this.unselectOthers(child);
        child.selected = true;
        this.notify();
      }
    }
  }

  private notify() {
    this.modelChange(this.model);
    this.change.emit(this.model);
  }

  private unselectOthers(child: SelectItemComponent<T>) {
    this.children.forEach((c) => {
      if (c !== child) {
        c.selected = false;
      }
    });
  }
}

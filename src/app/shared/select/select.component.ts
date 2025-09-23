import {
  Component,
  Input,
  QueryList,
  ContentChildren,
  AfterContentInit,
  Output,
  EventEmitter,
  OnInit,
  forwardRef,
} from '@angular/core';
import { AbstractNgModel } from '../model/abstract-ngmodel';
import { SelectItemComponent } from './select-item.component';
import { ngModelProvider } from '../model/ng-model-config';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [ngModelProvider(SelectComponent)],
  imports: [SelectItemComponent],
})
export class SelectComponent
  extends AbstractNgModel<any>
  implements OnInit, AfterContentInit
{
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
  change = new EventEmitter<any>();

  @ContentChildren(forwardRef(() => SelectItemComponent))
  children!: QueryList<SelectItemComponent>;

  private modelChecker = new Subject<any>();

  ngOnInit(): void {
    if (this.multiple) {
      this.model = [];
    }
  }

  ngAfterContentInit(): void {
    this.modelChecker.subscribe(() => this.doCheck());
  }

  override writeValue(obj: any): void {
    if (this.multiple && !Array.isArray(obj)) {
      this.model = [];
    } else {
      this.model = obj;
    }
    this.modelChecker.next(this.model);
  }

  doCheck() {
    if (this.multiple) {
      this.children.forEach((child) => {
        child.selected =
          this.model.filter((id: any) => child.value === id).length > 0;
      });
    } else {
      if (typeof this.model !== 'undefined') {
        let selectedChild = this.children.find(
          (child) => child.value === this.model,
        );
        if (selectedChild) {
          selectedChild.selected = true;
        }
      }
    }
  }

  onSelect(child: SelectItemComponent) {
    if (this.multiple) {
      let idx = this.model.indexOf(child.value);
      if (idx >= 0) {
        if (!(this.alwaysOneSelected && this.model.length === 1)) {
          this.model.splice(idx, 1);
          child.selected = false;
          this.notify();
        }
      } else {
        if (!this.max || this.model.length < this.max) {
          this.model.push(child.value);
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
        this.model = child.value;
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

  private unselectOthers(child: SelectItemComponent) {
    this.children.forEach((c) => {
      if (c !== child) {
        c.selected = false;
      }
    });
  }
}

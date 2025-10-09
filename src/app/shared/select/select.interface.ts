import { InjectionToken } from '@angular/core';
import { SelectItemComponent } from './select-item.component';

export interface ISelectComponent {
  onSelect(child: SelectItemComponent): void;
}

export const SELECT_COMPONENT_TOKEN = new InjectionToken<ISelectComponent>('SELECT_COMPONENT_TOKEN');
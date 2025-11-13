import { ControlValueAccessor } from '@angular/forms';

export abstract class AbstractNgModel<T> implements ControlValueAccessor {

  public model!: T;

  modelChange: (value: T) => void = () => {
    // This will be replaced by Angular's ControlValueAccessor
  };

  modelTouch: () => void = () => {
    // This will be replaced by Angular's ControlValueAccessor
  };

  writeValue(obj: T): void {
    this.model = obj;
  }

  registerOnChange(fn: (value: T) => void): void {
    this.modelChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.modelTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void;
}

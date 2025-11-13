import { forwardRef, Provider, Type } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

export function ngModelProvider(type: Type<unknown>): Provider {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true
  };
}

export function ngModelValidationProvider(type: Type<unknown>): Provider {
  return {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => type),
    multi: true
  };
}

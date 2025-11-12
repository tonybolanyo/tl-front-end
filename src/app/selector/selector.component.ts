import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Day } from './day';

@Component({
  standalone: true,
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorComponent),
      multi: true
    }
  ]
})
export class SelectorComponent implements ControlValueAccessor {
  @Input() days: Day[] = [];
  @Input() multiple: boolean = false;
  @Input() formControlName: string = '';

  selectedDays: Day[] = [];
  currentMonth: Date = new Date();
  daysInMonth: Day[] = [];

  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  ngOnInit() {
    this.generateDaysInMonth();
  }

  generateDaysInMonth() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const daysCount = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];
    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(year, month, i);
      this.daysInMonth.push(new Day(i, date));
    }
  }

  selectDay(day: Day) {
    if (this.multiple) {
      const index = this.selectedDays.findIndex(d => d.id === day.id);
      if (index > -1) {
        this.selectedDays.splice(index, 1);
      } else {
        this.selectedDays.push(day);
      }
    } else {
      this.selectedDays = [day];
    }
    this.onChange(this.selectedDays);
    this.onTouched();
  }

  isSelected(day: Day): boolean {
    return this.selectedDays.some(d => d.id === day.id);
  }

  previousMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.generateDaysInMonth();
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.generateDaysInMonth();
  }

  getMonthName(): string {
    return this.currentMonth.toLocaleString('en-US', { month: 'short' });
  }

  writeValue(value: any): void {
    if (value) {
      this.selectedDays = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

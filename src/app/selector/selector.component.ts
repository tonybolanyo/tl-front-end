import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class SelectorComponent implements ControlValueAccessor, AfterViewInit {
  @Input() days: Day[] = [];
  @Input() multiple: boolean = false;
  @Input() formControlName: string = '';
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  selectedDays: Day[] = [];
  currentMonth: Date = new Date();
  daysInMonth: Day[] = [];
  canScrollLeft: boolean = false;
  canScrollRight: boolean = false;

  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  ngOnInit() {
    this.generateDaysInMonth();
  }

  ngAfterViewInit() {
    setTimeout(() => this.checkScrollButtons(), 100);
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

  scrollLeft() {
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;
      container.scrollBy({ left: -400, behavior: 'smooth' });
    }
  }

  scrollRight() {
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;
      container.scrollBy({ left: 400, behavior: 'smooth' });
    }
  }

  onScroll() {
    this.checkScrollButtons();
  }

  checkScrollButtons() {
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;
      this.canScrollLeft = container.scrollLeft > 0;
      this.canScrollRight = 
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1;
    }
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

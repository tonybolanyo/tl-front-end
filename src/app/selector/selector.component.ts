import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Day } from './day';
import { ScrollDirection } from './scroll-direction.enum';

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
export class SelectorComponent implements ControlValueAccessor, AfterViewInit, OnDestroy, OnInit {
  @Input() days: Day[] = [];
  @Input() multiple: boolean = false;
  @Input() formControlName: string = '';
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // Exponemos el enum para usarlo en el template
  readonly ScrollDirection = ScrollDirection;

  selectedDays: Day[] = [];
  currentMonth: Date = new Date();
  daysInMonth: Day[] = [];
  canScrollLeft: boolean = false;
  canScrollRight: boolean = false;
  private dayButtonWidth: number = 0;
  private gapSize: number = 12;

  private onChange: (value: Day | Day[] | null) => void = () => {
    // This will be replaced by Angular's ControlValueAccessor
  };
  private onTouched: () => void = () => {
    // This will be replaced by Angular's ControlValueAccessor
  };

  ngOnInit() {
    this.generateDaysForMultipleMonths();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calculateDayButtonWidth();
      this.checkScrollButtons();

      // Escuchar cambios de tamaño de ventana
      window.addEventListener('resize', () => {
        this.calculateDayButtonWidth();
      });
    }, 100);
  }

  generateDaysForMultipleMonths() {
    // Generamos 3 meses: actual, siguiente y subsiguiente
    this.daysInMonth = [];

    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + monthOffset, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      const daysCount = new Date(year, month + 1, 0).getDate();

      for (let i = 1; i <= daysCount; i++) {
        const dayDate = new Date(year, month, i);
        this.daysInMonth.push(new Day(i, dayDate));
      }
    }
  }

  calculateDayButtonWidth() {
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;
      const firstButton = container.querySelector('.day-button') as HTMLElement;

      if (firstButton) {
        // Obtenemos el ancho real del botón incluyendo borders y padding
        this.dayButtonWidth = firstButton.offsetWidth;

        // Obtenemos el gap del estilo calculado
        const gridElement = container.querySelector('.days-grid') as HTMLElement;
        if (gridElement) {
          const computedStyle = window.getComputedStyle(gridElement);
          const gap = computedStyle.gap || computedStyle.columnGap;
          this.gapSize = parseFloat(gap) || 12;
        }
      }
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

  scroll(direction: ScrollDirection) {
    if (this.scrollContainer && this.dayButtonWidth > 0) {
      const container = this.scrollContainer.nativeElement;
      const containerWidth = container.clientWidth;
      const itemWidth = this.dayButtonWidth + this.gapSize;

      // Calculamos cuántos días completos caben en el viewport
      const visibleDaysCount = Math.floor(containerWidth / itemWidth);

      // Desplazamos el ancho de (visibleDaysCount - 2) días para que el último visible
      // de forma completa se convierta en el primero, es decir, no tenemos en cuenta
      // los dos días parcialmente visibles
      const scrollAmount = (visibleDaysCount - 2) * itemWidth;

      container.scrollBy({
        left: direction === ScrollDirection.Left ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
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

  getMonthNameForDay(day: Day): string {
    return day.time.toLocaleString('en-US', { month: 'short' });
  }

  trackByDay(_index: number, day: Day): number {
    return day.id;
  }

  writeValue(value: Day | Day[] | null): void {
    if (value) {
      this.selectedDays = Array.isArray(value) ? value : [value];
    }
  }

  registerOnChange(fn: (value: Day | Day[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngOnDestroy() {
    // Limpiamos el listener de resize
    window.removeEventListener('resize', () => {
      this.calculateDayButtonWidth();
    });
  }
}

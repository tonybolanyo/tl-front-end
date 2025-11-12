import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Day } from './day';
import { ScrollDirection } from './scroll-direction.enum';
import { SelectorComponent } from './selector.component';

describe('SelectorComponent', () => {
  let component: SelectorComponent;
  let fixture: ComponentFixture<SelectorComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.days).toEqual([]);
      expect(component.multiple).toBe(false);
      expect(component.selectedDays).toEqual([]);
      expect(component.canScrollLeft).toBe(false);
      expect(component.canScrollRight).toBe(false);
    });

    it('should generate days for 3 months on init', () => {
      component.ngOnInit();
      expect(component.daysInMonth.length).toBeGreaterThan(0);
      // 3 meses: aproximadamente 90 días
      expect(component.daysInMonth.length).toBeGreaterThanOrEqual(87);
      expect(component.daysInMonth.length).toBeLessThanOrEqual(93);
    });

    it('should expose ScrollDirection enum', () => {
      expect(component.ScrollDirection).toBe(ScrollDirection);
    });
  });

  describe('Day Generation', () => {
    it('should generate days with correct structure', () => {
      component.ngOnInit();
      const firstDay = component.daysInMonth[0];

      expect(firstDay).toBeInstanceOf(Day);
      expect(firstDay.id).toBeDefined();
      expect(firstDay.time).toBeInstanceOf(Date);
    });

    it('should generate consecutive days across months', () => {
      component.ngOnInit();
      const days = component.daysInMonth;

      // Verificar que hay días de diferentes meses
      const months = new Set(days.map(day => day.time.getMonth()));
      expect(months.size).toBeGreaterThanOrEqual(2);
    });

    it('should start from current month', () => {
      const now = new Date();
      component.currentMonth = now;
      component.ngOnInit();

      const firstDay = component.daysInMonth[0];
      expect(firstDay.time.getMonth()).toBe(now.getMonth());
      expect(firstDay.time.getFullYear()).toBe(now.getFullYear());
    });
  });

  describe('Day Selection - Single Mode', () => {
    beforeEach(() => {
      component.multiple = false;
      component.ngOnInit();
    });

    it('should select a single day', () => {
      const day = component.daysInMonth[0];
      component.selectDay(day);

      expect(component.selectedDays.length).toBe(1);
      expect(component.selectedDays[0]).toBe(day);
    });

    it('should replace previous selection when selecting another day', () => {
      const day1 = component.daysInMonth[0];
      const day2 = component.daysInMonth[1];

      component.selectDay(day1);
      expect(component.selectedDays.length).toBe(1);
      expect(component.selectedDays[0]).toBe(day1);

      component.selectDay(day2);
      expect(component.selectedDays.length).toBe(1);
      expect(component.selectedDays[0]).toBe(day2);
    });

    it('should call onChange when selecting a day', () => {
      spyOn(component as any, 'onChange');
      const day = component.daysInMonth[0];

      component.selectDay(day);

      expect((component as any).onChange).toHaveBeenCalledWith([day]);
    });

    it('should call onTouched when selecting a day', () => {
      spyOn(component as any, 'onTouched');
      const day = component.daysInMonth[0];

      component.selectDay(day);

      expect((component as any).onTouched).toHaveBeenCalled();
    });
  });

  describe('Day Selection - Multiple Mode', () => {
    beforeEach(() => {
      component.multiple = true;
      component.ngOnInit();
    });

    it('should select multiple days', () => {
      const day1 = component.daysInMonth[0];
      const day2 = component.daysInMonth[1];

      component.selectDay(day1);
      component.selectDay(day2);

      expect(component.selectedDays.length).toBe(2);
      expect(component.selectedDays).toContain(day1);
      expect(component.selectedDays).toContain(day2);
    });

    it('should deselect a day when clicked again', () => {
      const day = component.daysInMonth[0];

      component.selectDay(day);
      expect(component.selectedDays.length).toBe(1);

      component.selectDay(day);
      expect(component.selectedDays.length).toBe(0);
    });

    it('should toggle days correctly', () => {
      const day1 = component.daysInMonth[0];
      const day2 = component.daysInMonth[1];
      const day3 = component.daysInMonth[2];

      component.selectDay(day1);
      component.selectDay(day2);
      component.selectDay(day3);
      expect(component.selectedDays.length).toBe(3);

      component.selectDay(day2); // Deselect middle day
      expect(component.selectedDays.length).toBe(2);
      expect(component.selectedDays).toContain(day1);
      expect(component.selectedDays).toContain(day3);
      expect(component.selectedDays).not.toContain(day2);
    });
  });

  describe('isSelected', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should return true for selected day', () => {
      const day = component.daysInMonth[0];
      component.selectDay(day);

      expect(component.isSelected(day)).toBe(true);
    });

    it('should return false for unselected day', () => {
      const day = component.daysInMonth[0];

      expect(component.isSelected(day)).toBe(false);
    });

    it('should correctly identify selected days in multiple mode', () => {
      component.multiple = true;
      const day1 = component.daysInMonth[0];
      const day2 = component.daysInMonth[1];
      const day3 = component.daysInMonth[2];

      component.selectDay(day1);
      component.selectDay(day3);

      expect(component.isSelected(day1)).toBe(true);
      expect(component.isSelected(day2)).toBe(false);
      expect(component.isSelected(day3)).toBe(true);
    });
  });

  describe('Month Name Formatting', () => {
    it('should return month name for current month', () => {
      const monthName = component.getMonthName();
      expect(monthName).toBeTruthy();
      expect(typeof monthName).toBe('string');
      expect(monthName.length).toBe(3); // Abbreviated month name
    });

    it('should return month name for specific day', () => {
      const day = new Day(1, new Date(2025, 0, 1)); // January
      const monthName = component.getMonthNameForDay(day);

      expect(monthName).toBe('Jan');
    });

    it('should return different month names for days in different months', () => {
      const januaryDay = new Day(1, new Date(2025, 0, 1));
      const februaryDay = new Day(1, new Date(2025, 1, 1));

      const jan = component.getMonthNameForDay(januaryDay);
      const feb = component.getMonthNameForDay(februaryDay);

      expect(jan).not.toBe(feb);
    });
  });

  describe('Scroll Functionality', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should scroll left when direction is Left', () => {
      const scrollContainer = {
        nativeElement: {
          clientWidth: 800,
          scrollBy: jasmine.createSpy('scrollBy')
        }
      };
      component.scrollContainer = scrollContainer as any;
      (component as any).dayButtonWidth = 52;
      (component as any).gapSize = 12;

      component.scroll(ScrollDirection.Left);

      expect(scrollContainer.nativeElement.scrollBy).toHaveBeenCalled();

      const callArgs = scrollContainer.nativeElement.scrollBy.calls.first().args[0];
      expect(callArgs.left).toBeLessThan(0); // Should scroll left (negative value)
      expect(callArgs.behavior).toBe('smooth');
    });

    it('should scroll right when direction is Right', () => {
      const scrollContainer = {
        nativeElement: {
          clientWidth: 800,
          scrollBy: jasmine.createSpy('scrollBy')
        }
      };
      component.scrollContainer = scrollContainer as any;
      (component as any).dayButtonWidth = 52;
      (component as any).gapSize = 12;

      component.scroll(ScrollDirection.Right);

      expect(scrollContainer.nativeElement.scrollBy).toHaveBeenCalled();

      const callArgs = scrollContainer.nativeElement.scrollBy.calls.first().args[0];
      expect(callArgs.left).toBeGreaterThan(0); // Should scroll right (positive value)
      expect(callArgs.behavior).toBe('smooth');
    });

    it('should not scroll if dayButtonWidth is 0', () => {
      const scrollContainer = {
        nativeElement: {
          scrollBy: jasmine.createSpy('scrollBy')
        }
      };
      component.scrollContainer = scrollContainer as any;
      (component as any).dayButtonWidth = 0;

      component.scroll(ScrollDirection.Right);

      expect(scrollContainer.nativeElement.scrollBy).not.toHaveBeenCalled();
    });

    it('should calculate scroll amount based on visible days', () => {
      const containerWidth = 700;
      const dayWidth = 52;
      const gapSize = 12;
      const itemWidth = dayWidth + gapSize; // 64
      const visibleDaysCount = Math.floor(containerWidth / itemWidth); // 10
      const expectedScrollAmount = (visibleDaysCount - 2) * itemWidth; // 8 * 64 = 512

      const scrollContainer = {
        nativeElement: {
          clientWidth: containerWidth,
          scrollBy: jasmine.createSpy('scrollBy')
        }
      };
      component.scrollContainer = scrollContainer as any;
      (component as any).dayButtonWidth = dayWidth;
      (component as any).gapSize = gapSize;

      component.scroll(ScrollDirection.Right);

      const callArgs = scrollContainer.nativeElement.scrollBy.calls.first().args[0];
      expect(callArgs.left).toBe(expectedScrollAmount);
    });
  });

  describe('Scroll Button State', () => {
    it('should update canScrollLeft and canScrollRight', () => {
      const scrollContainer = {
        nativeElement: {
          scrollLeft: 100,
          scrollWidth: 1000,
          clientWidth: 500
        }
      };
      component.scrollContainer = scrollContainer as any;

      component.checkScrollButtons();

      expect(component.canScrollLeft).toBe(true);
      expect(component.canScrollRight).toBe(true);
    });

    it('should set canScrollLeft to false at start', () => {
      const scrollContainer = {
        nativeElement: {
          scrollLeft: 0,
          scrollWidth: 1000,
          clientWidth: 500
        }
      };
      component.scrollContainer = scrollContainer as any;

      component.checkScrollButtons();

      expect(component.canScrollLeft).toBe(false);
      expect(component.canScrollRight).toBe(true);
    });

    it('should set canScrollRight to false at end', () => {
      const scrollContainer = {
        nativeElement: {
          scrollLeft: 500,
          scrollWidth: 1000,
          clientWidth: 500
        }
      };
      component.scrollContainer = scrollContainer as any;

      component.checkScrollButtons();

      expect(component.canScrollLeft).toBe(true);
      expect(component.canScrollRight).toBe(false);
    });

    it('should call checkScrollButtons on scroll event', () => {
      spyOn(component, 'checkScrollButtons');

      component.onScroll();

      expect(component.checkScrollButtons).toHaveBeenCalled();
    });
  });

  describe('ControlValueAccessor Implementation', () => {
    it('should write value', () => {
      const days = [component.daysInMonth[0], component.daysInMonth[1]];

      component.writeValue(days);

      expect(component.selectedDays).toBe(days);
    });

    it('should handle null value in writeValue', () => {
      component.writeValue(null);
      expect(component.selectedDays).toEqual([]);
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);

      const day = component.daysInMonth[0];
      component.selectDay(day);

      expect(fn).toHaveBeenCalled();
    });

    it('should register onTouched callback', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);

      const day = component.daysInMonth[0];
      component.selectDay(day);

      expect(fn).toHaveBeenCalled();
    });
  });

  describe('DOM Rendering', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render day buttons', () => {
      const dayButtons = compiled.querySelectorAll('.day-button');
      expect(dayButtons.length).toBe(component.daysInMonth.length);
    });

    it('should display day number and month', () => {
      const firstButton = compiled.querySelector('.day-button');
      const dayNumber = firstButton?.querySelector('.day-number');
      const dayMonth = firstButton?.querySelector('.day-month');

      expect(dayNumber?.textContent?.trim()).toBeTruthy();
      expect(dayMonth?.textContent?.trim()).toBeTruthy();
    });

    it('should add selected class to selected day', () => {
      const day = component.daysInMonth[0];
      component.selectDay(day);
      fixture.detectChanges();

      const dayButtons = compiled.querySelectorAll('.day-button');
      expect(dayButtons[0].classList.contains('selected')).toBe(true);
    });

    it('should render Previous and Next buttons', () => {
      const buttons = compiled.querySelectorAll('.nav-button');
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent?.trim()).toContain('Previous');
      expect(buttons[1].textContent?.trim()).toContain('Next');
    });

    it('should disable Previous button when canScrollLeft is false', () => {
      component.canScrollLeft = false;
      fixture.detectChanges();

      const prevButton = compiled.querySelector('.nav-button') as HTMLButtonElement;
      expect(prevButton.disabled).toBe(true);
    });

    it('should disable Next button when canScrollRight is false', () => {
      component.canScrollRight = false;
      fixture.detectChanges();

      const buttons = compiled.querySelectorAll('.nav-button');
      const nextButton = buttons[1] as HTMLButtonElement;
      expect(nextButton.disabled).toBe(true);
    });

    it('should show/hide left gradient based on canScrollLeft', () => {
      component.canScrollLeft = true;
      fixture.detectChanges();

      const leftGradient = compiled.querySelector('.gradient-left');
      expect(leftGradient?.classList.contains('visible')).toBe(true);

      component.canScrollLeft = false;
      fixture.detectChanges();
      expect(leftGradient?.classList.contains('visible')).toBe(false);
    });

    it('should show/hide right gradient based on canScrollRight', () => {
      component.canScrollRight = true;
      fixture.detectChanges();

      const rightGradient = compiled.querySelector('.gradient-right');
      expect(rightGradient?.classList.contains('visible')).toBe(true);

      component.canScrollRight = false;
      fixture.detectChanges();
      expect(rightGradient?.classList.contains('visible')).toBe(false);
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should select day when clicked', () => {
      const dayButton = compiled.querySelector('.day-button') as HTMLButtonElement;
      const day = component.daysInMonth[0];

      dayButton.click();

      expect(component.isSelected(day)).toBe(true);
    });

    it('should call scroll method when Previous button clicked', () => {
      spyOn(component, 'scroll');
      component.canScrollLeft = true;
      fixture.detectChanges();

      const prevButton = compiled.querySelector('.nav-button') as HTMLButtonElement;
      prevButton.click();

      expect(component.scroll).toHaveBeenCalledWith(ScrollDirection.Left);
    });

    it('should call scroll method when Next button clicked', () => {
      spyOn(component, 'scroll');
      component.canScrollRight = true;
      fixture.detectChanges();

      const buttons = compiled.querySelectorAll('.nav-button');
      const nextButton = buttons[1] as HTMLButtonElement;
      nextButton.click();

      expect(component.scroll).toHaveBeenCalledWith(ScrollDirection.Right);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty daysInMonth array', () => {
      component.daysInMonth = [];
      fixture.detectChanges();

      const dayButtons = compiled.querySelectorAll('.day-button');
      expect(dayButtons.length).toBe(0);
    });

    it('should handle selecting the same day multiple times in single mode', () => {
      component.multiple = false;
      component.ngOnInit();
      const day = component.daysInMonth[0];

      component.selectDay(day);
      component.selectDay(day);
      component.selectDay(day);

      expect(component.selectedDays.length).toBe(1);
      expect(component.selectedDays[0]).toBe(day);
    });

    it('should handle missing scrollContainer gracefully', () => {
      component.scrollContainer = undefined as any;

      expect(() => component.scroll(ScrollDirection.Right)).not.toThrow();
      expect(() => component.checkScrollButtons()).not.toThrow();
    });
  });
});

import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { Day } from './selector/day';
import { SelectorComponent } from './selector/selector.component';
import { BoxComponent } from './shared/box/box.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [BoxComponent, HeaderComponent, ReactiveFormsModule, SelectorComponent],
})
export class AppComponent implements OnInit {
  days: Array<Day> = [];

  form!: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {
    for (let i = 0; i < 100; i++) {
      this.days.push(new Day(i, new Date(i * 100000000)));
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      selectedDays: [[this.days[0]]],
    });
  }
}

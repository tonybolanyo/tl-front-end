import { Component, OnInit } from '@angular/core';
import { Day } from './selector/day';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { BoxComponent } from './shared/box/box.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [BoxComponent, HeaderComponent, ReactiveFormsModule],
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

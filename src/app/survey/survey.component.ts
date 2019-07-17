import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DbServiceService } from '../db-service.service';

import { Record } from '../record';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})

export class SurveyComponent implements OnInit {
  surveyForm: FormGroup;
  submitted = false;

  constructor(private db: DbServiceService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.surveyForm = this.formBuilder.group({
      org: ['', Validators.required],
      site: ['', Validators.required],
      actId: ['', Validators.required],
      state: ['', Validators.required],
      county: ['', Validators.required],
      // beach descriptors
      // org modeled
      adviLevel: ['', Validators.required],
      daysPerYear: ['', Validators.required]
      // software package
      // stat model
      // time period
      // model usage
      // i vars
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.surveyForm.controls; }

  submitSurvey(): void {
    this.submitted = true;
    if (this.surveyForm.invalid) {
      window.scrollTo(0, 0);
      return;
    }
    const record = new Record();
    this.buildRecord(record);
    this.db.addRecord(record).subscribe();
  }

  buildRecord(record: Record): void {
    const inputs = document.getElementsByTagName('input');
    for (const i in inputs) {
        if (record.hasOwnProperty(inputs[i].id)) {
          if (inputs[i].type === 'text' || inputs[i].type === 'email') {
            record[inputs[i].id] = '"' + inputs[i].value + '"';
          } else if (inputs[i].type === 'number') {
            record[inputs[i].id] = inputs[i].value !== '' ? inputs[i].value : 0;
          } else {
            record[inputs[i].id] = inputs[i].checked === true ? 1 : 0;
          }
        }
    }
    const selects = document.getElementsByTagName('select');
    for (const j in selects) {
        if (record.hasOwnProperty(selects[j].id)) {
          if (selects[j].id === 'state') {
            record[selects[j].id] = '"' + selects[j].options[selects[j].selectedIndex].text + '"';
          }
        }
    }
  }

  toggleDisable(name): void {
    const textbox = document.getElementById(name);
    textbox.classList.toggle('disabled');
  }

  radioDisable(event: any, name): void {
    const textbox = document.getElementById(name);
    if (event.target.id !== name) {
      if (event.target.id === name + 'Check') {
        textbox.classList.remove('disabled');
      } else {
        textbox.classList.add('disabled');
      }
    }
  }

  clearForm(): void {
    const inputs = document.getElementsByTagName('input');
    for (const i in inputs) {
      if (inputs[i].type === 'text' || inputs[i].type === 'email' || inputs[i].type === 'number') {
        inputs[i].value = '';
        if (inputs[i].name.substring(inputs[i].name.length - 4) === 'Text') {
          inputs[i].classList.add('disabled');
        }
      } else if (inputs[i].type === 'radio' || inputs[i].type === 'checkbox') {
        inputs[i].checked = false;
      }
    }
    const selects = document.getElementsByTagName('select');
    for (const j in selects) {
      if (selects[j].id === 'state') {
        selects[j].selectedIndex = 0;
      }
    }
    window.scrollTo(0, 0);
  }

  populateForm(): void {
    // this method will populate the form with data from an existing record
  }
}

import {Component, OnInit} from '@angular/core';

import { DbServiceService } from '../db-service.service';

import { Record } from '../record';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})

export class SurveyComponent implements OnInit {

  constructor(private db: DbServiceService) {}

  ngOnInit() {
  }

  submitSurvey(): void {
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
    if (event.target.id === name + 'Check') {
      textbox.classList.remove('disabled');
    } else {
      textbox.classList.add('disabled');
    }
  }
}

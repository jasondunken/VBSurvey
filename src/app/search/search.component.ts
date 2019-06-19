import {Component, OnInit} from '@angular/core';

import {DbServiceService} from '../db-service.service';

import {Record} from '../record';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {

  constructor(private db: DbServiceService) {
  }

  ngOnInit() {
  }

  submitQuery(): void {
    const query = this.buildQuery();
    this.db.getRecords(query).subscribe((queryData: Record[]) => {
      this.displayResults(queryData);
    });
  }

  buildQuery(): string {
    const record = new Record();
    let query = '?';
    // convert input field values to a query string
    // handle inputs
    const inputs = document.getElementsByTagName('input');
    for (const i in inputs) {
      if (record.hasOwnProperty(inputs[i].id)) {
        if (inputs[i].type === 'text' || inputs[i].type === 'email') {
          if (inputs[i].value.length > 0) {
            query += inputs[i].id + "='" + inputs[i].value + "'&";
          }
        } else if (inputs[i].type === 'number') {
          // there are currently no number fields on the query form
        } else {
          if (inputs[i].checked === true) {
            query += inputs[i].id + '=1&';
          }
        }
      }
    }
    // handle selects
    query = query.substring(0, query.length - 1); // remove the trailing &
    return query;
  }
  /*Beach/Site Name	State/Region	County	Modeled Time Period	Model Type*/
  displayResults(results): void {
    console.log(results);
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

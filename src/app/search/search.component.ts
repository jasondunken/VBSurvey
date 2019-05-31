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
    return 'rows=*';
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

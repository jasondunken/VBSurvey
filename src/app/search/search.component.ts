import {Component, OnInit} from '@angular/core';

import {DbServiceService} from '../db-service.service';

import {Record} from '../record';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  searchResult = [];
  page = 1;
  count = 5;

  constructor(private db: DbServiceService) {
  }

  ngOnInit() {
    this.searchResult = [];
  }

  submitQuery(): void {
    const query = this.buildQuery();
    this.db.getRecords(query).subscribe((queryData: {}) => {
      this.searchResult = [];
      for (const i in queryData) {
        if (i === 'records') {
          this.searchResult = queryData[i];
        }
      }

      const pageSizeSelect  = document.getElementById('itemsPerPage') as  HTMLSelectElement;
      this.count = +(pageSizeSelect.options[pageSizeSelect.options.selectedIndex].value);
      const topResult = document.getElementById('results-table');
      topResult.hidden = false;
      // TODO: odd bug here, on first scrollTo it only scrolls part way, on subsequent scrollTo, it works as expected?
      topResult.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    });
  }

  updatePageSize(): void {
    const pageSizeSelect  = document.getElementById('itemsPerPage') as HTMLSelectElement;
    this.count = +(pageSizeSelect.options[pageSizeSelect.options.selectedIndex].value);
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
    const selects = document.getElementsByTagName('select');
    for (const j in selects) {
      if (record.hasOwnProperty(selects[j].id)) {
        if (selects[j].id === 'state' && selects[j].selectedIndex > 0) {
          query += "state='" + selects[j].options[selects[j].selectedIndex].text + "'&";
        }
      }
    }
    // handle selects
    query = query.substring(0, query.length - 1); // remove the trailing &
    return query;
  }

  toggleDisable(name): void {
    const textbox = document.getElementById(name);
    textbox.classList.toggle('disabled');
    textbox.toggleAttribute('disabled');
  }

  radioDisable(event: any, name): void {
    const textbox = document.getElementById(name);
    if (event.target.id !== name) {
      if (event.target.id === name + 'Check') {
        textbox.classList.remove('disabled');
        textbox.removeAttribute('disabled');
        textbox.innerHTML = '';
      } else {
        textbox.classList.add('disabled');
        textbox.setAttribute('disabled', 'true');
      }
    }
  }

  clearForm(): void {
    const inputs = document.getElementsByTagName('input');
    for (const i in inputs) {
      if (inputs[i].type === 'text' || inputs[i].type === 'email') {
          inputs[i].value = '';
          if (inputs[i].name.substring(inputs[i].name.length - 4) === 'Text') {
            inputs[i].classList.add('disabled');
            inputs[i].setAttribute('disabled', 'true');
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
    document.getElementById('results-table').hidden = true;
  }

  populateSurvey(): void {
    // this method will populate the survey form with data from an existing record
  }
}

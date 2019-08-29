import { Component, OnInit } from '@angular/core';

import { DbServiceService } from '../db-service.service';

import { Record } from '../record';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  numValsInRecord: number;
  files: FileList;
  rejectedCSVRecords = [];
  record: Record;

  constructor(private db: DbServiceService) { }

  ngOnInit() {
    this.record = new Record();
    this.numValsInRecord = 0;
    for (const key in this.record) {
      if (this.record.hasOwnProperty(key)) {
        this.numValsInRecord++;
      }
    }
  }

  // called when input.id='files'.onchange detected
  updateFileList(event): void {
    this.files = event.target.files;
  }

  // called by button.id='submit-file'
  handleUpload(): void {
    this.rejectedCSVRecords = [];
    if (this.files.length === 0) {
      console.log('no files selected!');
      return;
    }
    // tslint:disable-next-line: prefer-for-of
    for (let f = 0; f < this.files.length; f++) {
      // Reader created here
      // each file has its own Reader so files can be read in parallel
      const reader = new FileReader();
      reader.onload = (e) => {
        if (reader.result) {
          this.parseCSV(reader.result);
        } else {
          // error here?
        }
      };
      reader.readAsText(this.files[f]);
    }
  }

  parseCSV(file): void {
    const records: Record[] = [];
    // parse csv into individual Records and add to records array
    const lines = file.split('\n');
    for (const line in lines) {
      if (this.isValidRecordProperties(lines[line])) {
        records.push(this.csv2record(lines[line]));
      } else {
        this.rejectedCSVRecords.push({ invalidRecord: lines[line] });
      }
    }
    console.log('records: ' + JSON.stringify(records));
    if (records.length > 0) {
      this.batchLoadRecords(records);
    }
    if (this.rejectedCSVRecords.length > 0) {
      console.log('invalid records: ' + JSON.stringify(this.rejectedCSVRecords));
    }
  }

  isValidRecordProperties(line): boolean {
    // validate that the correct format is used and to remove column headings if present
    const vals = line.split(',');
    // hack to remove the time values form the csv as they are not part of a Record
    vals.splice(vals.length - 2, 2);
    if (vals.length !== this.numValsInRecord) {
      return false;
    }
    // validate correct types
    // index needs to be incremented first because function can return in a number of places
    // and index is used to access vals[]
    let index = -1;
    for (const key in this.record) {
      if (this.record.hasOwnProperty(key)) {
        index++;
        // validate booleans are either 1 or 0
        if (typeof this.record[key] === 'boolean' && (vals[index] !== '1' && vals[index] !== '0')) {
          return false;
        }
        // validate numbers
        if (typeof this.record[key] === 'number') {
          // because parseFloat has the undesirable behavior (in this instance)
          // of returning a float when a string begins with a number
          // even if the string contains letters
          // check to ensure val is only numeric
          if (vals[index].match(/[a-z]/i) || isNaN(parseFloat(vals[index]))) {
            return false;
          }
        }
      }
    }
    return true;
  }

  csv2record(line): Record {
    const record = new Record();
    const vals = line.split(',');
    let index = 0;
    for (const key in record) {
      if (record.hasOwnProperty(key)) {
        if (typeof record[key] === 'boolean') {
          record[key] = parseInt(vals[index], 10);
        }
        if (typeof record[key] === 'number') {
          record[key] = parseFloat(vals[index]);
        }
        if (typeof record[key] === 'string') {
          record[key] = vals[index];
        }
        index++;
      }
    }
    return record;
  }

  batchLoadRecords(records): void {
    // const testRecords = [new TestRecord(), new TestRecord()];
    this.db.batchLoadRecords(records).subscribe();
  }
}

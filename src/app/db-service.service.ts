import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Record } from './record';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({ providedIn: 'root' })

export class DbServiceService {
  private dbUrl = 'http://127.0.0.1:3000/api';
  constructor(private http: HttpClient) { }

  getRecords(query): Observable<Record[]> {
    return this.http.get<Record[]>(this.dbUrl + query)
      .pipe(
        tap(_ => this.log('fetched records')),
        catchError(this.handleError<Record[]>('getRecords', []))
      );
  }

  addRecord(record: Record): Observable<Record> {
    // console.log('addRecord: ' + JSON.stringify(record));
    const jsonRecord = JSON.stringify(record);
    return this.http.post<Record>(this.dbUrl, jsonRecord, httpOptions).pipe(
      tap((newRecord: Record) => this.log(`added new record to db: ${newRecord.eMail}`)),
      catchError(this.handleError<Record>('addRecord'))
    );
  }

  batchLoadRecords(records: Record[]): void {
    // console.log('batchLoad: ' + JSON.stringify(records));
    for (const r in records) {
      if (records[r]) {
        console.log('adding a record from the batch!');
        this.addRecord(records[r]);
      }
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status === 0) {
        alert('The server is currently unavailable, please try again later.');
      } else if (error.status === 400) {
        alert('The server had an issue with your request: ' + error.status);
      } else {
        alert('An error has been encountered, error.status: ' + error.status);
      }
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`DBService: ${message}`);
  }
}

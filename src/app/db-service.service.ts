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
    const jsonRecord = JSON.stringify(record);
    return this.http.post<Record>(this.dbUrl, jsonRecord, httpOptions).pipe(
      tap((newRecord: Record) => this.log(`added new record to db: ${newRecord.eMail}`)),
      catchError(this.handleError<Record>('addRecord'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`DBService: ${message}`);
  }
}

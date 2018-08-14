import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { catchError, retry } from 'rxjs/operators';

//Models
import { Document } from '../../shared/models/document';
import { Observable } from "rxjs/Observable";

@Injectable()
export class FileService {

  public static FILES_API = '/api/Files/';

  public constructor(private http: HttpClient) {}

  public downloadFile(document: Document) {
    this.http.get(FileService.FILES_API + document.link, { responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, document.documentName + document.extension)
    })
  }

  editDocument(document: Document): Observable<Document> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');


    return this.http.put<Document>(
      FileService.FILES_API + document.documentID, document, { headers: headers })
      .pipe(
      retry(5) // retry a failed request up to 3 times, but don't handle errros
      );
  }
}

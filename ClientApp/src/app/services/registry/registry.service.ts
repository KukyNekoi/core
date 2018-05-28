import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, retry } from 'rxjs/operators';

// Angular models from shared
import { Registry } from '../../shared/models/registry';
import { Document } from '../../shared/models/document';

@Injectable()
export class RegistryService {

  private static BASE_URL = '/api/Registries/';
  private static DEFAULT = 'DefaultRegistry/';
  private static QUANTITY = 'QuantityRegistry/';
  private static PERCENT = 'PercentRegistry/';
  private static LINK = 'LinkRegistry/';
  private static ACTIVITY = 'ActivityRegistry/';
  public static REGISTRIES_API = '/api/Registries/';
  public static ADD_FILE_DOCUMENT_METHOD = '/AddFileDocument';
  public static ADD_LINK_DOCUMENT_METHOD = '/AddLinkDocument';
  private static DOCUMENTS = 'Documents/';

  constructor(public http: HttpClient) { }

  getRegistry(registryId: number): Observable<Registry> {
      return this.http.get<Registry>(RegistryService.REGISTRIES_API + registryId);
  }


  addLinkDocument(document: Document, registryId: number) {
    this.http.post<Registry>(RegistryService.REGISTRIES_API + registryId
      + RegistryService.ADD_LINK_DOCUMENT_METHOD, document ).subscribe();
  }

  addFileDocument(document: Document, registryId: number) {
    this.http.post<Registry>(RegistryService.REGISTRIES_API + registryId
      + RegistryService.ADD_FILE_DOCUMENT_METHOD, document ).subscribe();
  }


  editRegistry(registry: Registry, type: number): Observable<Registry> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    let discriminator: string = RegistryService.DEFAULT;
    if (type === 0) {
      discriminator = RegistryService.DEFAULT;
    } else if (type === 1) {
      discriminator = RegistryService.QUANTITY;
    } else if (type === 2) {
      discriminator = RegistryService.PERCENT;
    } else if (type === 3) {
      alert('Tipo no definido'); // LinkRegistry and ActivityRegistry types aren't defined yet - link is 3 or 4?
    } else if (type === 4) {
      alert ('Tipo no definido');
    }

    return this.http.put<Registry>(RegistryService.BASE_URL + discriminator + registry.registryID , registry, { headers: headers })
      .pipe(
      retry(5) // retry a failed request up to 3 times, but don't handle errros
      );
  }

  deleteDocument(document: Document): Observable<Document> {
    return this.http.delete<Document>(RegistryService.BASE_URL + RegistryService.DOCUMENTS + document.documentID);
  }
}

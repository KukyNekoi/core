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
  public static REGISTRIES_API = '/api/Registries/';
  public static ADD_FILE_DOCUMENT_METHOD = '/AddFileDocument';
  public static ADD_LINK_DOCUMENT_METHOD = '/AddLinkDocument';
  private static DOCUMENTS = 'Documents/';

  constructor(public http: HttpClient) { }

  getRegistry(registryId: number): Observable<Registry> {
      return this.http.get<Registry>(RegistryService.REGISTRIES_API + registryId);
  }

  addLinkDocument(document: Document, registryId: number): Observable<Document[]> {
    return this.http.post<Document[]>(RegistryService.REGISTRIES_API + registryId
      + RegistryService.ADD_LINK_DOCUMENT_METHOD, document );
  }

  editRegistry(registry: Registry, registriesType: number): Observable<Registry> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    let discriminator: string = RegistryService.DEFAULT;
    if (registriesType === 0) {
      discriminator = RegistryService.DEFAULT;
    } else if (registriesType === 1) {
      discriminator = RegistryService.QUANTITY;
    } else if (registriesType === 2) {
      discriminator = RegistryService.PERCENT;
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

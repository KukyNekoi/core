import { Injectable } from '@angular/core';
import { Subject, Observable } from '../../../../node_modules/rxjs';

@Injectable()
export class LoaderService {
  public    loaderUpdateEvent: Observable<boolean>;
  private   loaderUpdateSubject: Subject<boolean>;
  private   eventList: Array<string>;

  constructor() {
      this.loaderUpdateSubject = new Subject<boolean>();
      this.loaderUpdateEvent = this.loaderUpdateSubject.asObservable();
      this.eventList = [];
  }

  // if there is no event on the queue, then the loader is released.
  public getStatus() {
    return !(this.eventList.length > 0);
  }

  // pushed a callback
  public push(symbol: string): void {
    this.eventList.push(symbol);
    this.loaderUpdateSubject.next(true);
  }

  // removes a callback
  public pop(symbol: string): void {
    const targetIndex = this.eventList.findIndex(item => {
      return item === symbol;
    });
    this.eventList.splice(targetIndex, 1);
    this.loaderUpdateSubject.next(true);
  }
}

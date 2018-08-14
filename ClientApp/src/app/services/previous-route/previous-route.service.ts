import { Injectable } from '@angular/core';
import {Router, NavigationEnd } from '@angular/router';

@Injectable()
export class PreviousRouteService {

  private previousUrl: string;
  private currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    this.previousUrl = '/home'; // First page load
    router.events.subscribe( event => {
      if (event instanceof NavigationEnd) {
        if (this.currentUrl !== event.url) {
          this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        }
      }
    });
   }

   public getPreviousUrl(): string {
    return this.previousUrl;
   }

}

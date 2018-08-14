import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: 'safeDom'
})
export class SafeDomPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(url: any, args?: any): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

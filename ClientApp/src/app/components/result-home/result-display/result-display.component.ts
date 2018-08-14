import { Component, OnInit, Input, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from "@angular/router";

@Component({
  selector: 'app-result-display',
  templateUrl: './result-display.component.html',
  styleUrls: ['./result-display.component.css']
})
export class ResultDisplayComponent implements OnInit {
  @Input() indicatorGroups;

  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  ngOnInit() {

  }

  gotoIndicatorGroup(idIndicatorGroup: number) {
    this.router.navigateByUrl('/indicatorGroup/' + idIndicatorGroup);
  }

}

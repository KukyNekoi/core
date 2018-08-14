import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { PreviousRouteService } from '../../services/previous-route/previous-route.service';

@Component({
  selector: 'app-navigation-buttons',
  templateUrl: './navigation-buttons.component.html',
  styleUrls: ['./navigation-buttons.component.css']
})
export class NavigationButtonsComponent implements OnInit {

  private router: Router;

  constructor(router: Router,
    private route: ActivatedRoute,
    private service: PreviousRouteService) {
    this.router = router;
  }

  ngOnInit() {
  }

  goBack() {
    const previousRoute: string = this.service.getPreviousUrl();
    this.router.navigateByUrl(previousRoute);
  }

  goHome() {
    this.router.navigateByUrl('/home');
  }

}

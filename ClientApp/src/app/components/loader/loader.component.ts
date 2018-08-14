import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader/loader.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  public loaderStatus = true;
  public subscription: Subscription;

  constructor(private loaderService: LoaderService) {
    this.subscription = this.loaderService.loaderUpdateEvent.subscribe(item => {
      this.loaderStatus = this.loaderService.getStatus();
    });
  }

  ngOnInit() {
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-indicator-graph-option',
  templateUrl: './indicator-graph-option.component.html',
  styleUrls: ['./indicator-graph-option.component.css']
})
export class IndicatorGraphOptionComponent implements OnInit {
  @Input() public graph: any;
  constructor() { }

  ngOnInit() {
  }

}

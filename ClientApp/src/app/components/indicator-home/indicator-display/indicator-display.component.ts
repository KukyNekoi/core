import { Component, OnInit, Input, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

// Model
import { IndicatorGroup } from '../../../shared/models/indicatorGroup';
import {Role} from '../../../shared/models/role';
import {RolesType} from '../../../shared/models/rolesType';

// Service
import { AuthService } from '../../../services/auth/AuthService';
import { PermissionClaim } from '../../../services/auth/permissions';

@Component({
  selector: 'app-indicator-display',
  templateUrl: './indicator-display.component.html',
  styleUrls: ['./indicator-display.component.css']
})

export class IndicatorDisplayComponent {
  @Input() indicatorResultsObservable: Observable<number[]>;
  @Input() goalsObservable: Observable<number[]>;
  @Input() indicatorGroup: IndicatorGroup;

  constructor(private router: Router, private authService: AuthService) {
  }

  gotoIndicator(idIndicatorGroup: number, idIndicator: number) {
    this.router.navigateByUrl('/indicator/' + idIndicatorGroup + '/' + idIndicator);
  }

  isAllowedToRead(indicatorId: number): boolean {
    return this.authService.isAllowedTo(indicatorId, PermissionClaim.READ);
  }

}

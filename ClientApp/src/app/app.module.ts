import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { HomeComponent, CounterComponent, FetchDataComponent } from './demo';
import { IndicatorDetailComponent } from './components/indicator-detail/indicator-detail.component';
import { IndicatorService } from './services/indicator/indicator.service';
import { DemoModule } from './demo/demo.module';


@NgModule({
  declarations: [
    AppComponent,
    IndicatorDetailComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,

    DemoModule,

    RouterModule.forRoot([
      { path: 'indicator-detail/:idIndicator', component: IndicatorDetailComponent },
      {path: 'demo',        loadChildren: () => DemoModule},
      {path: '',            loadChildren: () => DemoModule}
    ])
  ],
  providers: [IndicatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { IndicatorHomeComponent } from './components/indicator-home/indicator-home.component';
import { IndicatorDisplayComponent } from './components/indicator-home/indicator-display/indicator-display.component';
import { IndicatorDetailComponent } from './components/indicator-detail/indicator-detail.component';
import { RegistryFormComponent } from './components/registry-form/registry-form.component';
import { FileDocumentFormComponent } from './components/indicator-detail/file-document-form/file-document-form.component';
import { LinkDocumentFormComponent } from './components/indicator-detail/link-document-form/link-document-form.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResultHomeComponent } from './components/result-home/result-home.component';
import { ResultDisplayComponent } from './components/result-home/result-display/result-display.component';
import { ChartsModule } from 'ng2-charts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IndicatorService } from './services/indicator/indicator.service';
import { IndicatorGroupService } from './services/indicator-group/indicator-group.service';
import { RegistryEditorComponent } from './components/indicator-detail/registry-editor/registry-editor.component';
import { GoalsEditorComponent } from './components/indicator-detail/goals-editor/goals-editor.component';
import { RegistryService } from './services/registry/registry.service';
import { IndicatorGraphOptionComponent } from './components/indicator-detail/indicator-graph-option/indicator-graph-option.component';
import { IndicatorDetailRegistryComponent } from './components/indicator-detail/indicator-detail-registry/indicator-detail-registry.component';
import { AuthService } from './services/auth/AuthService';
import { CanActivateUser } from './services/auth/CanActivateService';
import { WelcomeComponent } from './components/welcome-component/welcome-component.component';
import { ReportgeneratorComponent } from './components/result-home/reportgenerator/reportgenerator.component';
import { FileService } from './services/file/file.service';
import { DocumentEditorComponent } from './components/indicator-detail/document-editor/document-editor.component';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { SessionService } from './services/session/session.service';
import { NavigationButtonsComponent } from './components/navigation-buttons/navigation-buttons.component';
import { DocumentPreviewComponent } from './components/indicator-detail/document-preview/document-preview.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { IndicatorGroupFormComponent } from './components/result-home/indicator-group-form/indicator-group-form.component';

@NgModule({
  declarations: [
    AppComponent,
    IndicatorDetailComponent,
    HeaderComponent,
    FooterComponent,
    IndicatorHomeComponent,
    IndicatorDetailComponent,
    IndicatorDisplayComponent,
    RegistryFormComponent,
    FileDocumentFormComponent,
    LinkDocumentFormComponent,
    RegistryEditorComponent,
    ResultDisplayComponent,
    IndicatorGraphOptionComponent,
    IndicatorDetailRegistryComponent,
    ResultHomeComponent,
    WelcomeComponent,
    ReportgeneratorComponent,
    DocumentEditorComponent,
    NavigationButtonsComponent,
    GoalsEditorComponent,
    DocumentPreviewComponent,
    IndicatorGroupFormComponent
  ],
  imports: [
    BsDropdownModule.forRoot(),
    NgbModule.forRoot(),
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    FlexLayoutModule,
    StorageServiceModule ,
    PdfViewerModule,

    RouterModule.forRoot([
      { path: 'indicator/:idIndicatorGroup/:idIndicator', component: IndicatorDetailComponent, canActivate: [CanActivateUser] },
      { path: 'indicatorGroup/:idIndicatorGroup',   component: IndicatorHomeComponent, canActivate: [CanActivateUser] },
      { path: 'home',        component: ResultHomeComponent, canActivate:[CanActivateUser] },
      { path: '',            component: WelcomeComponent },
      { path: '**',          component: ResultHomeComponent, canActivate: [CanActivateUser] },
    ], { onSameUrlNavigation: 'reload' })
  ],
  providers: [IndicatorService, IndicatorGroupService, RegistryService, AuthService, CanActivateUser, SessionService, FileService],
  bootstrap: [AppComponent]
})
export class AppModule { }

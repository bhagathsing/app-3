import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BusyModule } from 'angular2-busy';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SelectModule } from './common/select/select.module';

import { LoginModule } from './login/login.module';
import { MyteModule } from './myte/myte.module';
import { AppComponent } from './app.component';
import { AppRoute } from './app.routes';
import { DataService } from './service/DataService';
import { LiveDataService } from './service/LiveDataService';
import { CalendarModule } from './common/calendar/calendar.module';
import { ConfirmModule } from '../app/common/confirm/confirm.module';
import { MultiselectDropdownModule } from './common/dropdown/dropdown.module';
import { OutSideClickDirective } from './common/directives/out-side-click.directive';

@NgModule({
  declarations: [
    AppComponent,
    OutSideClickDirective
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoute,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    BusyModule,
    LoginModule,
    MyteModule,
    SelectModule,
    CalendarModule.forRoot(),
    ConfirmModule.forRoot(),
    MultiselectDropdownModule.forRoot(),
  ],
  entryComponents: [],
  providers: [
    { provide: DataService, useClass: LiveDataService }

  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }

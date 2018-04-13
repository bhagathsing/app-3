import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyteComponent } from './myte.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { myTeRouting } from './myte.routing';

import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap';


import { AuthGuard } from '../service/auth-guard.service';
import { Ng2Storage } from '../service/storage';
import { HeaderComponent } from '../common/header/header.component';
import { FooterComponent } from '../common/footer/footer.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BusyModule} from 'angular2-busy';
import { EmptyTableComponent } from '../common/utils/empty-table/empty-table.component';

import { CalendarModule } from '../common/calendar/calendar.module';

import { CommonService} from '../../app/service/common.service';
import { MultiselectDropdownModule } from '../common/dropdown/dropdown.module';

import { ConfirmModule } from '../../app/common/confirm/confirm.module';

import { SelectModule } from '../common/select/select.module';
import { AddChargeCodeComponent } from './admin/add-charge-code/add-charge-code.component';
import { AssignChargeCodeComponent } from './owner/assign-charge-code/assign-charge-code.component';
import { AssignComponent } from './owner/assign-charge-code/assign/assign.component';
import { AdminComponent } from './admin/admin.component';
import { OwnerComponent } from './owner/owner.component';
import { SponsorComponent } from './sponsor/sponsor.component';
import { ReportsComponent } from './reports/reports.component';
import { ChargeCodeDetailsComponent } from './charge-code-details/charge-code-details.component';
import { DatePickComponent } from '../common/date-pick/date-pick.component';
import { CreateTaskComponent } from './owner/create-task/create-task.component';
import { OnlyNumber } from '../common/directives/only-number.directive';
import { GroupByValuePipe } from '../common/pipes/groupByValue';
import { RemoveDuplicatePipe } from '../common/pipes/removeDuplicate';
import { ValidityDetailsComponent } from './owner/validity-details/validity-details.component';
import {ManageOwnerComponent} from './sponsor/manage-owner/manage-owner.component';
import { OwnerDetailsComponent } from './sponsor/owner-details/owner-details.component';
import {RoleMappingComponent} from './admin/roles/role-mapping/role-mapping.component';
import { RolesComponent } from './admin/roles/roles.component';
import {ModalPopupComponent} from '../common/modal-popup/modal-popup.component';
import {AngularMultiSelectModule} from '../common/multi-select-dropdown/multiselect.component';
import { ChargeCodeTreeComponent } from './sponsor/charge-code-tree/charge-code-tree.component';
import { ContactusComponent } from './contactus/contactus.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UserGuideComponent } from './user-guide/user-guide.component';
import { FaqComponent } from './faq/faq.component';
import { HelpComponent } from './help/help.component';

import {TreeModule} from '../common/angular-tree/angular-tree-component';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import {AlertConfirmComponent} from '../common/alert-confirm/alert-confirm.component';



@NgModule({
    imports: [
        myTeRouting,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        CollapseModule.forRoot(),
        TooltipModule.forRoot(),
        TypeaheadModule.forRoot(),
        BrowserAnimationsModule,
        BusyModule,
        CalendarModule.forRoot(),
        ConfirmModule.forRoot(),
        SelectModule,
        MultiselectDropdownModule.forRoot(),
        AngularMultiSelectModule,
        TreeModule,
        PdfViewerModule
    ],
    declarations: [
        HeaderComponent,
        FooterComponent,
        MyteComponent,
        DashboardComponent,
        NotFoundComponent,
        EmptyTableComponent,
        AddChargeCodeComponent,
        AssignChargeCodeComponent,
        AssignComponent,
        AdminComponent,
        OwnerComponent,
        SponsorComponent,
        ReportsComponent,
        ChargeCodeDetailsComponent,
        DatePickComponent,
        CreateTaskComponent,
        OnlyNumber,
        GroupByValuePipe,
        RemoveDuplicatePipe,
        ValidityDetailsComponent,
        ManageOwnerComponent,
        OwnerDetailsComponent,
        RoleMappingComponent,
        RolesComponent,
        ModalPopupComponent,
        ChargeCodeTreeComponent,
        ContactusComponent,
        FeedbackComponent,
        UserGuideComponent,
        FaqComponent,
        HelpComponent,
        AlertConfirmComponent
    ],
    exports: [
        MyteComponent
    ],
    providers: [
        AuthGuard,
        Ng2Storage,
        CommonService,
        DatePipe
    ],
    entryComponents: [
        AssignComponent,
        AddChargeCodeComponent,
        CreateTaskComponent,
        ValidityDetailsComponent,
        ManageOwnerComponent,
        RoleMappingComponent,
        AlertConfirmComponent
    ]
})
export class MyteModule {
}

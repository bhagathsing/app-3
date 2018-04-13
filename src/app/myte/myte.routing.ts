import { RouterModule, Routes } from '@angular/router';
import { MyteComponent } from './myte.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { NotFoundComponent } from '../not-found/not-found.component';

import { AuthGuard } from '../service/auth-guard.service';
import { AssignChargeCodeComponent } from './owner/assign-charge-code/assign-charge-code.component';
import { AdminComponent } from './admin/admin.component';
import { OwnerComponent } from './owner/owner.component';
import { ReportsComponent } from './reports/reports.component';
import { ChargeCodeDetailsComponent } from './charge-code-details/charge-code-details.component';
import { SponsorComponent } from './sponsor/sponsor.component';
import {RolesComponent} from './admin/roles/roles.component';
import {ChargeCodeTreeComponent} from './sponsor/charge-code-tree/charge-code-tree.component';
import {ContactusComponent} from './contactus/contactus.component';
import {FeedbackComponent} from './feedback/feedback.component';
import {UserGuideComponent} from './user-guide/user-guide.component';
import {FaqComponent} from './faq/faq.component';
import {HelpComponent} from './help/help.component';

const routes: Routes = [
    {path: 'app', component: MyteComponent, children: [
        {path: 'admin', component: AdminComponent, canActivate: [AuthGuard], children: [
            {path: '', component: DashboardComponent, children: [
                {path: '', component: ChargeCodeDetailsComponent},
                {path: '', redirectTo: '/', pathMatch: 'full'},
            ]},
            {path: 'reports', component: ReportsComponent},
            {path: 'sponsorList', component: RolesComponent},
            {path: '', redirectTo: '/', pathMatch: 'full'},
            {path: '**', component: NotFoundComponent}
        ]},
        {path: 'owner', component: OwnerComponent, canActivate: [AuthGuard], children: [
            {path: '', component: DashboardComponent, children: [
                {path: '', component: ChargeCodeDetailsComponent},
                {path: 'assignChargeCode', component: AssignChargeCodeComponent},
                {path: '', redirectTo: '/', pathMatch: 'full'},
            ]},
            {path: 'reports', component: ReportsComponent},
            {path: '', redirectTo: '/', pathMatch: 'full'},
            {path: '**', component: NotFoundComponent}
        ]},
        {path: 'sponsor', component: SponsorComponent, canActivate: [AuthGuard], children: [
            {path: '', component: DashboardComponent, children: [
                {path: '', component: ChargeCodeDetailsComponent},
                {path: '', redirectTo: '/', pathMatch: 'full'},
            ]},
            {path: 'reports', component: ReportsComponent},
            {path: 'taskList', component: ChargeCodeDetailsComponent},
            {path: 'assignChargeCode', component: AssignChargeCodeComponent},
            {path: 'chargeCodeTree', component: ChargeCodeTreeComponent},
            {path: '', redirectTo: '/', pathMatch: 'full'},
            {path: '**', component: NotFoundComponent}
        ]},
        {path: 'contact-us', component: ContactusComponent},
        {path: 'feedback', component: FeedbackComponent},
        {path: 'user-guide', component: UserGuideComponent},
        {path: 'faq', component: FaqComponent},
        {path: 'help', component: HelpComponent},
        {path: '', redirectTo: 'admin', pathMatch: 'full', canActivate: [AuthGuard]},
        {path: '**', component: NotFoundComponent}
    ]}
];

export const myTeRouting = RouterModule.forChild(routes);

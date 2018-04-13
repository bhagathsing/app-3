import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { Ng2Storage } from '../../service/storage';
import { DataService } from '../../service/DataService';
import { CommonService } from '../../service/common.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { filter } from 'lodash';
import { LastLogin } from '../../app.interface';


@Component({
  selector: 'myte-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public userData: any;
  public modalRef: BsModalRef;
  public userId: any;
  public lastLoginData: LastLogin;
  constructor(
    private storage: Ng2Storage,
    private dataService: DataService,
    private commonService: CommonService,
    private modalService: BsModalService,
    private router: Router, ) { }

  public ngOnInit() {
    //this.getUserDetails();
    this.getLastLoginDetails();
  }
  public getLastLoginDetails() {
    this.userId = this.storage.getSession('user_data');
    this.userData = this.storage.getSession('user');
   this.dataService.getLastLoginDate(this.userId.employeeId).subscribe((data: LastLogin) => {
      this.lastLoginData = data;
   })
  }


  public openModal(template: TemplateRef<any>) {
    // this.modalRef = this.modalService.show(ConfigSettingsComponent);
  }
  public logOut() {
    this.storage.removeSession('user_data');
    this.storage.clearAllSession();
    this.router.navigate(['/login']);
  }
  public goToHome() {
    this.router.navigate(['/']);
  }
}


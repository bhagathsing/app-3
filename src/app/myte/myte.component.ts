import { Component, OnInit, ViewChild , ElementRef } from '@angular/core';
import { ConfirmComponent } from '../common/confirm/confirm.component';
import { CommonService} from '../service/common.service';
import {Router} from '@angular/router';
import {Ng2Storage} from '../service/storage';
@Component({
    moduleId: module.id,
    selector: 'app-myte',
    templateUrl: 'myte.component.html',
    styleUrls: ['myte.component.scss']
})
export class MyteComponent implements OnInit {
    @ViewChild(ConfirmComponent) public confirmModal: ConfirmComponent;
    @ViewChild('headerNav') public headerNav: ElementRef;
    public confirmPopupData: any;
    public empData;
    public siteMenus: {name: string; url: string}[] = [
      {name: 'Contact us', url: './contact-us'},
      // {name: 'Feedback', url: './feedback'},
      {name: 'User Guide', url: './user-guide'},
      {name: 'FAQ', url: './faq'}
    ];
  constructor( private commonService: CommonService, private router: Router, private storage: Ng2Storage) {}
    ngOnInit() {
      this.empData = this.storage.getSession('user_data');
        this.confirmPopupData =  this.commonService.setConfirmOptions('Confirm', 'Are you sure want to submit without saving details ?', 'Yes', 'Cancel', 'warning');
        this.commonService.configurSaving.subscribe((data) => {
            if (data) {
                this.confirmPopupData =  this.commonService.setConfirmOptions('Success', 'Data saved successfully', 'Ok', '--', 'success');
                this.confirmModal.show(null)
                .then((): void => {
                }).catch(() => {
                });
            }else {
                this.confirmPopupData =  this.commonService.setConfirmOptions('Error', 'Data  not saved', 'Ok', '--', 'danger');
                this.confirmModal.show(null)
                .then((): void => {
                }).catch(() => {
                });
            }
        });
    }
  public gotoHome() {
    this.router.navigate(['/']);
  }
}

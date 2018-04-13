import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {LoginResponse} from '../../app.interface';
import {Ng2Storage} from '../../service/storage';
import {CommonService} from '../../service/common.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public userData: LoginResponse;
  public tabMenu: any[];
  constructor( private router: Router, private storage: Ng2Storage, private commonService: CommonService) { }

  ngOnInit() {
    this.userData = this.storage.getSession('user_data');
    this.tabMenu = this.commonService.ObjectToJsonToObject(this.userData.menuList).map( o => {
      o['active'] = '';
      if (o.menuName === 'Charge Code Details') {
        o.url = './';
      }
      return o;
    });
    this.router.events.subscribe((data: any) => {
      if (this.router.url) {
        let txt = this.router.url.indexOf('assignChargeCode');
        if (txt !== -1) {
          this.tabMenu[0].active = 'active';
        }else {
          this.tabMenu[0].active = '';
        }
      }
    });
  }

}

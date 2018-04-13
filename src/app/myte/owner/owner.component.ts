import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Ng2Storage} from '../../service/storage';
import {LoginResponse} from '../../app.interface';
import {CommonService} from '../../service/common.service';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {
  public userData: LoginResponse;
  public tabMenu: any[];
  constructor( private router: Router, private storage: Ng2Storage, private commonService: CommonService) { }

  ngOnInit() {
    this.userData = this.storage.getSession('user_data');
    this.tabMenu = this.commonService.ObjectToJsonToObject(this.userData.menuList).map( o => {
      o['active'] = '';
      if (o.menuName === 'Task List') {
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

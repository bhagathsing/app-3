import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ChargeCodeDetailsData, ResourcesByChargeCode } from '../../../app.interface';
import { DataService } from '../../../service/DataService';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AssignComponent } from './assign/assign.component';
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../../../service/common.service';
import { ConfirmComponent } from '../../../common/confirm/confirm.component';
import {ValidityDetailsComponent} from '../validity-details/validity-details.component';
import * as _ from 'lodash';
declare const $: any;
@Component({
  selector: 'app-assign-charge-code',
  templateUrl: './assign-charge-code.component.html',
  styleUrls: ['./assign-charge-code.component.css']
})
export class AssignChargeCodeComponent implements OnInit, OnDestroy {
  @ViewChild(ConfirmComponent) public confirmModal: ConfirmComponent;

  public headerRowHeight: number = 40;
  public bodyRowHeight: number = 30;
  public gridData: ResourcesByChargeCode;
  public bsModalRef: BsModalRef;
  public selectedRow: ChargeCodeDetailsData;
  public busy: Subscription;
  private unSubscribe1: Subscription;
  public confirmPopupData: any;
  public isCollapsed: boolean = false;

  public modalConfig = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false,
    class: ' modal-lg add-assign'
  };

  public gridHeaders: {name: string; field: string, width: string}[] = [
    {name: 'User Id', field: 'user_id', width: '100'},
    {name: 'User Name', field: 'user_name', width: '190'},
    // {name: 'Reporting Manager', field: 'approver_name', width: '160'},
    {name: 'Task Code Description', field: 'charge_code_task_desc', width: '160'},
    {name: 'Time Period', field: 'time_period_name', width: '180'}
  ];
  constructor(
    private route: Router,
    private dataService: DataService,
    private modalService: BsModalService,
    private routes: ActivatedRoute,
    private commonService: CommonService,
    private _location: Location) { }

  public ngOnInit() {
    this.confirmPopupData = this.commonService.setConfirmOptions('Success', 'Success', 'Ok', '--', 'success');
    this.unSubscribe1 = this.routes.queryParams.subscribe((data: ChargeCodeDetailsData) => {
     // data['charge_code_owners'] = JSON.parse(data.charge_code_owner);
      this.getGridData(data.charge_code_task_id);
     // console.log(data);
      this.selectedRow = data;
    });

    this.commonService.addUserEmit.subscribe(() => {
      this.confirmPopupData = this.commonService.setConfirmOptions('Success', 'Success', 'Ok', '--', 'success');
      this.confirmModal.show(null)
      .then((): void => {
        $.fn.dataTableExt.sErrMode = 'throw';
        $('#tableGrid').DataTable().clear().destroy();
        this.getGridData(this.selectedRow.charge_code_task_id);
      }).catch(() => {
      });
    });

    this.modalService.onHidden.subscribe((data) => {
    });
  }
  public ngOnDestroy() {
   this.unSubscribe1.unsubscribe();
  }
  public stringToJson( obj) {
    return JSON.parse(obj);
  }

  private getGridData( id: string | number) {
    this.busy =  this.dataService.getResourcesByChargeCode(id).subscribe((data: ResourcesByChargeCode) => {
      data.details =_.uniqBy(data.details, 'user_id');
     // console.log(user_id);

      this.gridData = data;
      let pageLengthArray1 = [10, 25, 50, -1];
      pageLengthArray1.unshift(5);
      let pageLengthArray2 = [10, 25, 50, 'All'];
        pageLengthArray2.unshift(5);
      setTimeout(() => {
        $('#tableGrid').DataTable({
          'lengthMenu': [pageLengthArray1, pageLengthArray2 ],
          'order': [[ 1, 'asc' ]]
        });
        $('#tableGrid_filter').find('.form-control').removeClass('input-sm');
        $('#tableGrid_length').find('.form-control').removeClass('input-sm');

      }, 4);
    });
  }

  public backToChargeCode() {
    //this.route.navigate(['../']);
    this._location.back();
  }

  public assignChargeCode( row?: any ) {
    this.bsModalRef = this.modalService.show(AssignComponent);
    this.bsModalRef.content.rowData = this.selectedRow;
    if ( row) {
      this.bsModalRef.content.gridRowData = row;
    }
  }
  public collapsed(event: any): void {
    //console.log(event);
  }

  public expanded(event: any): void {
    //console.log(event);
  }
  public onValidityDetails( row: ChargeCodeDetailsData) {
    this.bsModalRef = this.modalService.show(ValidityDetailsComponent, this.modalConfig);
    this.bsModalRef.content.rowData = row;
  }

}

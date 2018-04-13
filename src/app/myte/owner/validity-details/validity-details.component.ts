import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {Subscription} from 'rxjs/Subscription';
import {DataService} from '../../../service/DataService';
import {ChargeCodeDetailsData, TimePeriodsDetail, TimePeriodsDetailData} from '../../../app.interface';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ModalPopupComponent} from '../../../common/modal-popup/modal-popup.component';

@Component({
  selector: 'app-validity-details',
  templateUrl: './validity-details.component.html',
  styleUrls: ['./validity-details.component.css']
})
export class ValidityDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('modalPopup') modalPopup;
  public rowData: ChargeCodeDetailsData;
  public busy: Subscription;
  public periodData: TimePeriodsDetail;
  public headerRowHeight: number = 40;
  private selectedRow: TimePeriodsDetailData;
  public modalMessage = 'Are you sure want to deactivate ?';

  public gridHeaders: {name: string; field: string, width: string}[] = [
    {name: 'Time Period', field: 'time_period_name', width: '180'},
    {name: 'Status', field: 'user_charge_code_map_status', width: '190'}
  ];

  constructor(
    public bsModalRef: BsModalRef,
    private dataService: DataService,
    private modalService: BsModalService) {}

  public ngOnInit() {
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      console.log(this.rowData);
      this.getTimeValidityData(this.rowData);
    }, 400);
  }
  public getTimeValidityData( obj ) {
    let taskCode = obj.charge_code_task_id;
    let fd = new Date(obj.user_charge_code_map_validFrom);
    let td = new Date(obj.user_charge_code_map_validTo);
    let st = `${fd.getFullYear()}-${fd.getMonth() + 1}-${fd.getDate()}`;
    let ed = `${td.getFullYear()}-${td.getMonth() + 1}-${td.getDate()}`;

    this.busy =  this.dataService.getAssignedPopupView(taskCode, st, ed, obj.user_id).subscribe((data) => {
      console.log(this.selectedRow);
      if(this.selectedRow) {
        this.selectedRow.isActive = this.selectedRow.user_charge_code_map_status === 'Active' ? true : false;
      }
      this.periodData = data;
    });

  }
  public isActiveDeactive( obj ) {
    console.log(obj);
    setTimeout(() => {
      this.selectedRow = obj;
      obj.isActive = obj.user_charge_code_map_status === 'Active' ? true : false;
      this.modalPopup.show().then(() => {
        this.setActiveDeactive(this.selectedRow);
      }).catch((e) => {
        console.log('close');
      });
    });


  }

  public deleteValidity( row: TimePeriodsDetailData ) {
    let assId = row.emp_charg_code_map_id;
    let taskId = this.rowData.charge_code_task_id;
    this.dataService.deleteAssignmentStatusById(assId, taskId).subscribe((data) => {
      console.log( data );
      if(data.actionStatus) {
        this.getTimeValidityData( this.rowData);
      }
    });
  }

  public setActiveDeactive( obj: TimePeriodsDetailData) {
    let assId = obj.emp_charg_code_map_id;
    let tpId = obj.time_period_id;
    let taskId = this.rowData.charge_code_task_id;
    let status = obj.user_charge_code_map_status === 'Active' ? 'Inactive' : 'Active';
    this.busy =  this.dataService.setAssignmentStatusById(assId, tpId, taskId, status).subscribe((data) => {
      if (data.actionStatus) {
        this.getTimeValidityData( this.rowData);
      }
    });
  }

}

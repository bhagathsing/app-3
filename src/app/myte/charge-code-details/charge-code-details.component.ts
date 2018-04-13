import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../service/DataService';
import { ChargeCodeDetails, LoginResponse, ChargeCodeDetailsData, PeriodData, EmployeeData} from '../../app.interface';
import { Subscription } from 'rxjs/Subscription';
import { Ng2Storage } from '../../service/storage';
import { CommonService } from '../../service/common.service';
import { ConfirmComponent } from '../../common/confirm/confirm.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddChargeCodeComponent } from '../admin/add-charge-code/add-charge-code.component';
import { CreateTaskComponent } from '../owner/create-task/create-task.component';
import * as _ from 'lodash';
import {ManageOwnerComponent} from '../sponsor/manage-owner/manage-owner.component';


declare const $: any;
@Component({
  selector: 'app-charge-code-details',
  templateUrl: './charge-code-details.component.html',
  styleUrls: ['./charge-code-details.component.css']
})
export class ChargeCodeDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(ConfirmComponent) public confirmModal: ConfirmComponent;
  public headerRowHeight: number = 40;
  public bodyRowHeight: number = 30;
  public gridData: ChargeCodeDetails;
  public busy: Subscription;
  public userData: LoginResponse;
  public selectedRow: ChargeCodeDetailsData;
  public confirmPopupData: any;
  public bsModalRef: BsModalRef;
  public periodObj: PeriodData;
  private chargeCodeLists: string[];
  public isActiveState: boolean = false;
  public isSponsorOwner: boolean = false;


  private ownerHeaders: any[] = [
    {name: 'Task Id', field: 'charge_code_task_code', width: '140'},
    {name: 'Task Name', field: 'charge_code_task_desc', width: '140'}
    // {name:'Task Type',field:'charge_code_type_desc',width:'140'}
  ];
  public gridHeaders: any[] = [
    {name: 'Charge Code', field: 'charge_code', width: '140'},
    {name: 'Charge Code Description', field: 'charge_code_description', width: '180'},
    // {name:'Valid From',field:'valid_from',width:'180'},
    // {name:'Valid Till',field:'valid_to',width:'180'},
  ];

  public modalConfig = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  public unicField = 'charge_code';

  constructor(
    private route: Router,
    private routeActive: ActivatedRoute,
    private dataService: DataService,
    private storage: Ng2Storage,
    private commonService: CommonService,
    private modalService: BsModalService) { }

  public ngOnInit() {
    this.isSponsorOwner = this.route.url === '/app/sponsor/taskList';
     this.userData =  this.storage.getSession('user_data');
    // this.unicField = (this.userData.employeeRoleName === 'ChargeCodeAdmin' ||
    // (this.userData.employeeRoleName === 'ChargeCodeSponsor' && !this.isSponsorOwner) ) ?  'charge_code' : '';
    this.unicField = '';

    if (this.userData.employeeRoleName === 'ChargeCodeOwner' || this.isSponsorOwner) {
      this.gridHeaders.splice.apply(this.gridHeaders, [0, 0].concat(this.ownerHeaders));
      let h = [
        {name: 'Sponsor', field: 'sponsor', width: '200'},
        {name: 'Validity Period', field: 'validity', width: '260'},
        {name: 'Status', field: 'charge_code_task_status', width: '100'}
      ]; //sponsor
      this.gridHeaders.push.apply(this.gridHeaders, h);
    }
    if (this.userData.employeeRoleName === 'ChargeCodeAdmin' || this.userData.employeeRoleName === 'ChargeCodeSponsor') {
      let header = [
        {name: 'Charge Code Type', field: 'charge_code_type', width: '150'}
      ];
      this.gridHeaders.push.apply(this.gridHeaders, header);
    }
    if (this.userData.employeeRoleName === 'ChargeCodeAdmin' || (this.userData.employeeRoleName === 'ChargeCodeSponsor' && !this.isSponsorOwner)) {
      let headers = [
        {name: 'Owner', field: 'charge_code_owner', width: '190'},
        {name: 'Sponsor', field: 'sponsor', width: '160'},
        {name: 'Validity Period', field: 'valid_from', width: '260'},
        {name: 'Status', field: 'status', width: '160'}
      ];
      this.gridHeaders.push.apply(this.gridHeaders, headers);
    }
    this.confirmPopupData = this.commonService.setConfirmOptions('Success', 'Success', 'Ok', '--', 'success');
    this.getAllPeriods();
    this.commonService.addChargeCodeSuccess.subscribe(( data) => {
      console.log('data----');
    });
    this.getAllEmployeeDetails();
    this.modalService.onHidden.subscribe((data) => {
      if (data) {
        this.confirmPopupData = this.commonService.setConfirmOptions(data.title, data.msg, 'Ok', '--', data.type);
        this.confirmModal.show(null)
          .then((): void => {
            if (data.status) {
              $.fn.dataTableExt.sErrMode = 'throw';
              $('#tableGrid_1').DataTable().clear().destroy();
              this.getGridData();

            }
          }).catch(() => {
        });
      }
    });
  }
  public ngOnDestroy() {
  }
  public getAllPeriods() {
    let periodData = this.storage.getSession('periods');
    this.busy = this.dataService.getAllTimePeriod().subscribe((data: PeriodData) => {
        if (data) {
          if (!periodData) {
            data.timePeriodMasterBean.forEach(( obj ) => {
              obj.timePeriodName = obj.timePeriodName.replace(/To/g, ' - ');
            });
            this.storage.setSession('periods', data);
            this.periodObj = data;
          }else {
            this.periodObj = this.storage.getSession('periods');
          }
        }
       // this.currentPeriod = data.currentPeriodDetailsBean.timePeriodId;
    });
  }
  public ngAfterViewInit() {
    $.fn.dataTableExt.sErrMode = 'throw';
    $('#tableGrid_1').DataTable().destroy();

  }
  public refreshData() {
    $.fn.dataTableExt.sErrMode = 'throw';
    $('#tableGrid_1').DataTable().clear().destroy();
    this.getGridData();
  }
  private getGridData() {
    let empName = (this.userData.employeeRoleName === 'ChargeCodeAdmin' || this.userData.employeeRoleName === 'ChargeCodeSponsor') ? 'ChargeCodeAdmin' : this.userData.employeeRoleName;
    this.busy = this.dataService.getChargeCodesDetails(this.userData.employeeRoleName, this.userData.employeeId, this.isSponsorOwner)
      .subscribe((data: ChargeCodeDetails) => {
      this.gridData = this.mapGridData(data);
      this.chargeCodeLists = _.uniqBy(data.details, 'charge_code').map( o => {
        let obj = {
          charge_code: o.charge_code,
          charge_code_id: o.charge_code_parent_id,
          charge_code_description: o.charge_code_description,
          valid_from: o.valid_from,
          valid_to: o.valid_to
        };
        return obj;
      });
      console.log(this.chargeCodeLists);
      if (this.userData.employeeRoleName === 'ChargeCodeOwner' || this.isSponsorOwner) {
        let taskCodes = this.gridData.details.map(( o) => {
          let obj = {};
          obj['charge_code_task_code'] = o.charge_code_task_code;
          obj['charge_code_task_desc'] = o.charge_code_task_desc;
          return obj;
        });
        this.storage.setSession('task_codes', taskCodes);
      }
      this.storage.setSession('charge_codes', this.chargeCodeLists);
      let pageLengthArray1 = [10, 25, 50, -1];
      let sortOpt = this.userData.employeeRoleName === 'ChargeCodeAdmin' ?  0 : 1;
      pageLengthArray1.unshift(5);
      let pageLengthArray2 = [10, 25, 50, 'All'];
        pageLengthArray2.unshift(5);
      setTimeout(() => {
        $('#tableGrid_1').DataTable({
          'lengthMenu': [pageLengthArray1, pageLengthArray2 ],
          'order': [[ sortOpt, 'asc' ]]
        });
        $('#tableGrid_1_filter').find('.form-control').removeClass('input-sm');
        $('#tableGrid_1_length').find('.form-control').removeClass('input-sm');
      }, 10);
    });
  }

  private mapGridData(data) {
    let allEmp = this.storage.getSession('allemp').details;
    data.details.forEach((obj) => {
      let ids = obj.charge_code_owner_emp.split(',');
      obj.charge_code_owner = allEmp.filter( o => ids.indexOf(o.userId) !== -1);
    });
    return data;
  }

  public getAllEmployeeDetails() {
    let allEmp = this.storage.getSession('allemp');
    if (!allEmp) {
      this.busy = this.dataService.getAllEmployeeDetails().subscribe((data: EmployeeData) => {
        let objs = this.mapEmployeesData(data);
        this.storage.setSession('allemp', objs);
        this.getGridData();
      });
    }else {
      this.getGridData();
    }
  }

  private mapEmployeesData( data: EmployeeData) {
    data.details.map((obj) => {
      obj['empName'] = `${obj.userId} - ${obj.userName}`;
      return obj;
    });
    return data;
  }
  public addChargeCode( row?: ChargeCodeDetailsData) {
   this.bsModalRef = this.modalService.show(AddChargeCodeComponent, Object.assign({class: ' modal-lg add-assign'}, this.modalConfig));
   if (row) {
    this.bsModalRef.content.rowData = row;
   }
   this.bsModalRef.content.title = row ? 'Edit Charge Code' : 'Create Charge Code';
   this.bsModalRef.content.chargeCodeData = this.chargeCodeLists;
  }

  public assignChargeCode( objs ) {
    if (this.selectedRow || objs) {
      let row = this.selectedRow ? this.selectedRow : objs;
      let obj = JSON.parse(JSON.stringify(row));
      obj.charge_code_owner = JSON.stringify(obj.charge_code_owner)
      let urls = this.isSponsorOwner ? '/app/sponsor/assignChargeCode' : '/app/owner/assignChargeCode';
      this.route.navigate([urls], { queryParams: obj}); //his.router.navigate([type], {queryParams: {page: pageNo}});
    }else {
      this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Please select task code', 'Ok', '--', 'danger');
      this.confirmModal.show(null)
        .then((): void => {
        }).catch(() => {
        });
    }
  }
  public getSelectRow( obj: ChargeCodeDetailsData ) {
    this.selectedRow = obj;
    this.isActiveState = obj.charge_code_task_status.toLowerCase() !== 'active';
  }

  public creatTask( row?: ChargeCodeDetailsData) {
      this.bsModalRef = this.modalService.show(CreateTaskComponent, this.modalConfig);
      if (row) {
        this.bsModalRef.content.rowData = row;
      }
      this.bsModalRef.content.title = row ? 'Edit Task' :  'Create Task';
  }
  public isActiveChargeCode(row: ChargeCodeDetailsData) {
    let status = row.isActive ? 'active' : 'inactive';
    this.dataService.setChargeCodeActiveInactive(row.charge_code_id, status).subscribe((data) => {
    });
  }

  public editTaskCode( row: ChargeCodeDetailsData) {
  }
  public editOwner( row: ChargeCodeDetailsData) {
    this.bsModalRef = this.modalService.show(ManageOwnerComponent, this.modalConfig);
    this.bsModalRef.content.ownerData = [].concat(this.gridData.details);
    this.bsModalRef.content.rowData = row;
  }

}

import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EmployeeData, EmployeeDetails, PeriodData, LoginResponse, CurrentPeriod } from '../../../../app.interface';
import { CommonService } from '../../../../service/common.service';
import { Ng2Storage } from '../../../../service/storage';
import { DataService } from '../../../../service/DataService';
import { Subscription } from 'rxjs/Subscription';
import {DatePipe} from '@angular/common';
import {DatePickComponent} from '../../../../common/date-pick/date-pick.component';
@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css']
})
export class AssignComponent implements OnInit, AfterViewInit {

  @ViewChild(DatePickComponent) datePick: DatePickComponent;
  public configAllEmpData: EmployeeData;
  public trSubmitToList: EmployeeDetails[] = [];
  public clonePeriodData: CurrentPeriod[] = [];
  public trSubmitToListModel: any[] = [];
  public periodObj: PeriodData;
  public periods: string;
  public busy: Subscription;
  private rowData: any;
  private userData: LoginResponse;
  public datePickObj: any;
  public isDatePickerOpen = false;
  public status: { isopen: boolean } = { isopen: false };
  public isDateValid: boolean = false;
  public dateRange: string;
  public gridRowData: any;
  public currentDate: string;

  public mySettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true,
    isIdShow: true
  };
  public periodSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true
  };
  public myTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };
  @HostListener('document:click', ['$event'])
  onDocumentClick(e) {
    if (e.target && e.target.id === 'stEndDate') {
      this.status.isopen = true;
    }else {
      this.status.isopen = false;
    }
  }
  constructor(
    public bsModalRef: BsModalRef,
    private commonService: CommonService,
    private storage: Ng2Storage,
    private dataService: DataService,
    private datePipe: DatePipe) { }

  ngOnInit() {

    this.getAllEmployeeDetails();
    this.periodObj = this.storage.getSession('periods');
    this.datePickObj = this.storage.getSession('periods').currentPeriodDetailsBean.timePeriodLastdate;
    //this.getAllPeriods();
    //this.periods[0] = this.periodObj.currentPeriodDetailsBean;
    this.periods = '';
    this.clonePeriodData = this.periodObj.timePeriodMasterBean;
    this.userData =  this.storage.getSession('user_data');
    setTimeout(() => {
      this.dateRange = `${this.datePipe.transform(this.rowData.charge_code_task_validfrom, 'd MMM y')} - ${this.datePipe.transform(this.rowData.charge_code_task_validto, 'd MMM y')}`;
    }, 200);
  }
  public ngAfterViewInit() {
    setTimeout(() => {
      if (this.gridRowData) {
        this.editAssignedUser(this.gridRowData);
      }
    }, 100);
  }
  public onSearch(event) {
      this.trSubmitToList = this.commonService.filterMultiSelectData(this.configAllEmpData.details, event.filter, 'userName');
  }
  public onSearchPeriod(event) {
    this.trSubmitToList = this.onFilter(this.periodObj.timePeriodMasterBean, event.filter, 'timePeriodName');
  }
  private onFilter(data, filterModel, key) {
    return data.filter(function (obj) {
        return obj[key].toLocaleLowerCase().indexOf(filterModel.toLocaleLowerCase()) > -1;
    });
  }
  public getAllPeriods() {
    this.busy = this.dataService.getAllTimePeriod().subscribe((data: PeriodData) => {
        if (data) {
          data.timePeriodMasterBean.unshift({
            timePeriodId: 0,
            timePeriodLastdate: 1513276200000,
            timePeriodName: '-- Select time period --'
          });
        }

    });
  }
  public getAllEmployeeDetails() {
    let allEmp = this.storage.getSession('allemp');
    if(!allEmp) {
      this.busy = this.dataService.getAllEmployeeDetails().subscribe((data: EmployeeData) => {
        this.storage.setSession('allemp', data);
        this.configAllEmpData = this.storage.getSession('allemp');
        this.trSubmitToList = this.storage.getSession('allemp').details;
      });
    }else {
      this.configAllEmpData = allEmp;
      this.trSubmitToList = allEmp.details;
    }
  }

  public getTimeReport2(name) {
    this.trSubmitToListModel = name;
    console.log(name);
  }
  public onPriodChange( evt ) {
    this.periods = evt;
  }
  public removeSlUsers(index, arr) {
    arr.splice(index, 1);
  }
  public addUser() {
    if (this.trSubmitToListModel.length > 0 && this.periods.length > 0) {
      this.saveUser();
    }
  }

  private saveUser() {
    let saveObj = this.saveObjectPrepare();
    let serviceName = this.gridRowData ? 'updateUserTaskMap' : 'saveAssignChargeCodes';
    this.busy = this.dataService[serviceName](saveObj).subscribe((data) => {
      this.bsModalRef.hide();
      if (data.actionStatus) {
        setTimeout(() => {
          this.commonService.addUserEmit.emit(true);
        }, 600);
      }
    }, (err) => {
      console.log('ERROR', err);
    });
  }

  private saveObjectPrepare() {
    //console.log(this.trSubmitToListModel);
    let selectedUser = this.trSubmitToListModel.map(( objs ) => {
      return objs.userId;
    });
    let d = new Date();
    // this.getDatePeriodIds(this.periodObj.timePeriodMasterBean),

    let fd = Date.parse(this.periods.split(' - ')[0]);
    let td = Date.parse(this.periods.split(' - ')[1]);
    let obj: any;
    if (!this.gridRowData) {
      obj = {
        empIds: selectedUser,
        chargeCodeTaskIds: [+this.rowData.charge_code_task_id],
        timePeriodValidFrom: fd,
        timePeriodValidTo: td,
        charge_code_assign_by: this.userData.employeeId,
        user_charge_code_assign_date: `
          ${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}
        `  //2017-11-09 10:30:17
      };
    }else {
      obj = {
        details: [
          {
            emp_id: selectedUser[0],
            charge_code_id: this.rowData.charge_code_task_id,
            user_charge_code_map_validFrom: this.datePipe.transform(fd, 'yyyy-M-d'),
            user_charge_code_map_validTo: this.datePipe.transform(td, 'yyyy-M-d'),
            charge_code_assign_by: this.userData.employeeId,
            user_charge_code_assign_date: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
          }
        ],
        actionStatus: true,
        errorMessage: null
      };
    }
    return obj;
  }
  public onFocusDate(evt) {
    evt.stopPropagation();
    this.status.isopen = true;
  }
  public changeDatePick( value) {
    this.status.isopen = value;
    this.isDatePickerOpen = value;
    if (this.periods) {
      let val = this.periods.split(' - ');
      this.isDateValid = val.length == 2;
    }else {
      this.isDateValid = false;
    }
  }

  public stopClosing( evt: Event) {
    evt.stopImmediatePropagation();
  }
  public changeDate( obj) {
    this.periods = obj.dateModel;
    if (obj.dateFullFill) {
      this.status.isopen = !this.status.isopen;
      this.isDatePickerOpen = false;

    }
  }

  private getDatePeriodIds( arr: CurrentPeriod[]) {
    let stDate: Date = new Date(this.periods.split(' - ')[0]);
    let endDate: Date = new Date(this.periods.split(' - ')[1]);
    let sd = `${stDate.getDate()} ${this.commonService.monthNames[stDate.getMonth()]} ${stDate.getFullYear()}`;
    let ld = `${endDate.getDate()} ${this.commonService.monthNames[endDate.getMonth()]} ${endDate.getFullYear()}`;

    let sd1 = `${stDate.getDate() === 1 ? stDate.getDate() : 16} ${this.commonService.monthNames[stDate.getMonth()]} ${stDate.getFullYear()}`;
    let sd2 = `${stDate.getDate() === 1 ? 15 : this.commonService.Month[stDate.getMonth()]} ${this.commonService.monthNames[stDate.getMonth()]} ${stDate.getFullYear()}`;

    let ld1 = `${endDate.getDate() === 15 ? 1 : 16 } ${this.commonService.monthNames[endDate.getMonth()]} ${endDate.getFullYear()}`;
    let ld2 = `${endDate.getDate() === 15 ? 1 : endDate.getDate()} ${this.commonService.monthNames[endDate.getMonth()]} ${endDate.getFullYear()}`;

    let stD = sd1 + ' - ' + sd2;
    let ldD = ld1 + ' - ' + ld2;

    let stInd = arr.findIndex((obj) => {
      return obj.timePeriodName === stD;
    });
    let ldInd = arr.findIndex((obj) => {
      return obj.timePeriodName === ldD;
    });

    let findIds = arr.slice(stInd, (ldInd + 1)).map( o => o.timePeriodId);
    return findIds;
  }
  public editAssignedUser( obj ) {
    this.currentDate =  `${this.datePipe.transform(obj.user_charge_code_map_validFrom, 'M/d/yyyy')} - ${this.datePipe.transform(obj.user_charge_code_map_validTo, 'M/d/yyyy')}`;
    this.periods = this.currentDate;
    this.trSubmitToListModel = [{
      empName: `${obj.user_id} - ${obj.user_name}`,
      userId: obj.user_id,
      userName: obj.user_name
    }];
  }
}

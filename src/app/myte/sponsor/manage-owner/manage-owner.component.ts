import {AfterViewInit, Component, OnInit} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {
  AllUsersWithRoles, ChargeCodeDetailsData, EmployeeData, EmployeeDetails, LoginResponse, OwnerParamObj,
  SponsorList
} from '../../../app.interface';
import {CommonService} from '../../../service/common.service';
import {Ng2Storage} from '../../../service/storage';
import {DataService} from '../../../service/DataService';
import {Subscription} from 'rxjs/Subscription';
import { uniqBy } from 'lodash';
import {BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-manage-owner',
  templateUrl: './manage-owner.component.html',
  styleUrls: ['./manage-owner.component.css']
})
export class ManageOwnerComponent implements OnInit, AfterViewInit {
  public rowData: ChargeCodeDetailsData;
  public ownerData: ChargeCodeDetailsData[];
  public cloneListData: EmployeeDetails[] = [];
  public employeeModel: EmployeeDetails[] = [];
  public configAllEmpData: EmployeeData;
  public busy: Subscription;
  public userData: LoginResponse;
  public sponsorsList: AllUsersWithRoles;
  public isHadInSponosrList: any = [];
  public mySettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true,
    isIdShow: true
  };
  public errorForNoOwners = '';

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
  constructor(
    public bsModalRef: BsModalRef,
    private commonService: CommonService,
    private storage: Ng2Storage,
    private dataService: DataService,
    private modalService: BsModalService) { }

  public ngOnInit() {
    this.userData = this.storage.getSession('user_data');
    this.getAllEmployeeDetails();
    this.getSposors();
  }
  public ngAfterViewInit() {

    setTimeout(() => {
      let owners = this.rowData.charge_code_owner_emp.split(',');
      let selectedOwners = this.configAllEmpData.details.filter( o => owners.indexOf(o.userId) !== -1).map(( obj) => {
        return {
          userName: obj.userName,
          userId: obj.userId,
          empName: `${obj.userId} - ${obj.userName}`,
          isDelete: true,
          isOldOwner: true,
          isActive: true,
          isError: false
        };
      });
      this.employeeModel = selectedOwners;
    }, 100);
  }
  public onSearch(event) {
    this.cloneListData = this.commonService.filterMultiSelectData(this.configAllEmpData.details, event.filter, 'userName');
  }
  public getAllEmployeeDetails() {
    let allEmp = this.storage.getSession('allemp');
    if (!allEmp) {
      this.busy = this.dataService.getAllEmployeeDetails().subscribe((data: EmployeeData) => {
        this.storage.setSession('allemp', data);
        this.configAllEmpData = this.storage.getSession('allemp');
        this.cloneListData = this.storage.getSession('allemp').details;
      });
    }else {
      this.configAllEmpData = allEmp;
      this.cloneListData = allEmp.details;
    }
  }
  public changeList( selectedObj) {

    this.employeeModel = selectedObj;
    this.validateOwners(this.employeeModel);
  }
  private validateOwners( emp: any[]) {
    let adminRoles = this.sponsorsList.details.filter( o => o.role_name === 'ChargeCodeAdmin');
    let sponsor = adminRoles.map( o => o.user_id);
    emp.forEach( (obj) => {
      obj.isError = false;
      if (sponsor.indexOf(obj.userId) > -1) {
        obj.isError = true;
      }
    });
    this.isHadInSponosrList = emp.filter( obj => obj.isError);
  }
  public removeSlUsers(index, arr) {
    arr.splice(index, 1);
    this.validateOwners(arr);
    this.errorForNoOwners = '';
  }
  public addOwner() {
    if (this.employeeModel.length > 0) {
      this.errorForNoOwners = '';
      let obj = this.mapSaveObj();
      this.busy =  this.dataService.updateOwnerInChargeCode( obj ).subscribe((data) => {
        if (data.actionStatus) {
          this.bsModalRef.hide();
          setTimeout(() => {
            let msg = {
              status: true,
              title: 'Success',
              type: 'success',
              msg: 'Saved successfully'
            };
            // this.commonService.addChargeCodeSuccess.emit(msg);
            this.modalService.onHidden.emit(msg);
          }, 800);
        }
        if (data.errorMessage) {
          this.errorForNoOwners = data.errorMessage;
        }
      }, (e) => {
        let error = JSON.parse(e._body);
        this.errorForNoOwners = error.errorMessage;
      });
    } else {

    }
  }

  private mapSaveObj() {
    let owerns = this.employeeModel.filter( (o: any) => !o.isOldOwner);
    let saveObj: OwnerParamObj = {
      details: [
        {
          ChargeCodeID: this.rowData.charge_code_id,
          ChargeCodeOldOwners: [],
          ChargeCodeNewOwners: owerns.map( o  =>  o.userId ),
          empId: this.userData.employeeId,
          role: this.userData.employeeRoleName
        }
      ],
      actionStatus: true,
      errorMessage: null
    };

    return saveObj;
  }

  private getSposors() {
    this.busy = this.dataService.getAllRoleMaps().subscribe((data) => {
      this.sponsorsList = data;
    }, (err) => {
      console.log(err);
    });
  }
}

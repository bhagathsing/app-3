import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Ng2Storage } from '../../../../service/storage';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../../../service/DataService';
import {
  AllDivisions, AllDivisionsData,
  AllFunctionGroupData, AllFunctionGroups,
  AllRegions, AllRegionsData, AllUsersWithRoles,
  EmployeeData, Roles,
  RolesData
} from '../../../../app.interface';
import { CommonService } from '../../../../service/common.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { compact, find } from 'lodash';
import {Observable} from 'rxjs/Observable';
import {bootstrapItem} from '@angular/cli/lib/ast-tools';

@Component({
  selector: 'app-role-mapping',
  templateUrl: './role-mapping.component.html',
  styleUrls: ['./role-mapping.component.css']
})
export class RoleMappingComponent implements OnInit, AfterViewInit {

  public title: string;
  public rowData:any;
  public roleMapForm: FormGroup;
  public confirmPopupData: any;
  public busy: Subscription;
  public allEmployees: EmployeeData;
  public reoleModel: any[] = [];
  public allRolesData: Roles;
  public allRolesDataOptions: any[];
  public empModel: any[] = [];
  public selectedEmp: any[] = [];
  public functionGroups: AllFunctionGroupData[];
  public configAllEmpData: EmployeeData;
  public selectedChargeCodes: any[] = [];
  public disabled: boolean = true;
  public dataSource: Observable<any>;
  public AllRolesUsers: AllUsersWithRoles;

  public roleModel: any[] = [
    {roleId: 11, roleName: 'ChargeCodeSponsor'}
  ];
  public selectedFields: boolean = true;

  public typeName: string;
  public divisionsData: AllDivisionsData[] = [{
    division_id: '',
    division_name: '-- Select division --',
    region_id: 0
  }];

  public subFunctionData: any[] = [{
    sub_function_grp_id: '',
    sub_function_grp_name: '-- Select Sub Function --'
  }];

  public regions: AllRegionsData[] = [{
    region_id: '',
    region_name: '-- Select Region -- '
  }];

  private _disabledV: string = '0';

  public formObject: any = {
    sponsor: [],
    function_group: '',
    sub_function: '',
    region: '',
    divisions: ''
  };

  private validationMessages = {
    'function_group': { 'required':  'Function Group is required.'},
    'sub_function': {'required':  'Sub Function is required.'},
    'region': {'required':  'Region is required.'},
    'divisions': {'required':  'Division is required.'},
    'sponsor': {'required': 'Sponsor is required', 'adminRole': 'Selected user cannot be Sponsor/Owner'}
  };

  public formErrors = {
    function_group: '',
    sub_function: '',
    region: '',
    divisions: '',
    sponsor: '',
  };


  private formObjects = {
    function_group: [
      this.formObject.function_group,
      [Validators.required]
    ],
    sub_function: [
      this.formObject.sub_function,
      [Validators.required]
    ],
    region: [
      this.formObject.region,
      [Validators.required]
    ],
    divisions: [
      this.formObject.divisions,
      [Validators.required]
    ],
    sponsor: [
      this.formObject.sponsor,
      [Validators.required]
    ]
  };



  constructor(
    private storage: Ng2Storage,
    private dataService: DataService,
    private commonService: CommonService,
    private router: Router,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService) { }

  public ngOnInit() {
    this.confirmPopupData = this.commonService.setConfirmOptions('Confirm', 'Are you sure want to submit without saving details ?', 'Yes', 'Cancel', 'warning', 'No'
    );
    this.getAllEmployeeDetails();
    this.getRoles();
    this.getAllRolesUsers();
    this.getAllRegions();
    this.getFuncdtionGroup();
    this.buildForm(this.formObjects);
   // this.setValidity( this.selectedFields);
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      if (this.rowData) {
        this.onEditView( this.rowData);
      }
    }, 100);
  }

  private setValidity( val: boolean) {
    let allKeys = Object.keys(this.formObject);
    let arr = val ? allKeys : allKeys.slice(0, 3);
    // this.roleMapForm.controls['function_group'].clearValidators();
    // this.roleMapForm.controls['function_group'].updateValueAndValidity();
    //
    // this.roleMapForm.controls['sub_function'].clearValidators();
    // this.roleMapForm.controls['sub_function'].updateValueAndValidity();
    //
    // this.roleMapForm.updateValueAndValidity();
    // allKeys.forEach( ( ele) => {
    //   this.roleMapForm.controls[ele].clearValidators();
    //   this.roleMapForm.controls[ele].updateValueAndValidity();
    //   this.roleMapForm.updateValueAndValidity();
    // });
    // arr.forEach( ( ele) => {
    //   this.roleMapForm.controls[ele].setValidators([Validators.required])
    //   this.roleMapForm.controls[ele].updateValueAndValidity();
    //   this.roleMapForm.updateValueAndValidity();
    // });

    // role: this.roleModel,
    //   sponsor: '',
    //   application: '',
    //   function_group: '',
    //   sub_function: '',
    //   region: '',
    //   divisions: ''
  }
  public selected(value: any): void {

    let selectedItem = { taskId: value.taskId, taskName: value.taskName };
  }

  public removed(value: any): void {
  }

  public onSelected(value: any): void {
    this.roleModel[0] =  value;
  }

  public onRemoved(value: any): void {
    this.roleModel = [];
  }

  public buildForm( objs: any): void {
    this.roleMapForm = this.fb.group(objs);
    this.roleMapForm.valueChanges.subscribe(data => this.onValuesChanged());
    this.onValuesChanged();
    this.selectedValueChanges();
  }

  public onValuesChanged(data?: any) {
    if (!this.roleMapForm) { return; }
    const form = this.roleMapForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.invalid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  private getFuncdtionGroup() {
    this.busy = this.dataService.getAllFunctionGroups().subscribe((data: AllFunctionGroups) => {
      if (data.details) {
        data.details.unshift({
          'function_grp_id': '',
          'function_grp_name': '-- Select Function Group --'
        });
      }
      this.functionGroups = data.details;
    });
  }

  public changeGroup( obj) {
    let id = parseInt(obj, 10);
    this.busy = this.dataService.getAllSubFunctionGroups(id).subscribe((data) => {
      data.details.unshift({
        sub_function_grp_id: '',
        sub_function_grp_name: '-- Select Sub Function --'
      });
      this.subFunctionData = data.details;
    });
  }
  public changeSubFunction( obj) {
    let id = parseInt(obj, 10);
    this.busy = this.dataService.getAllSubFunctionGroups(id).subscribe((data) => {
      data.details.unshift({
        sub_function_grp_id: '',
        sub_function_grp_name: '-- Select Sub Function --'
      });
      this.subFunctionData = data.details;
    });
  }
  public getAllDevisions( id) {
    this.busy = this.dataService.getAlldivisions( id).subscribe((data: AllDivisions) => {
      if (data.details) {
        data.details.unshift({
          division_id: '',
          division_name: '-- Select division --',
          region_id: 0
        });
      }
      this.divisionsData = data.details;
    });
  }
  public getAllRegions() {
    this.busy = this.dataService.getAllregions().subscribe((data: AllRegions) => {
      if(data.details) {
        data.details.unshift({
          region_id: '',
          region_name: '-- Select Region -- '
        });
      }
      this.regions = data.details;
    });
  }
  private selectedValueChanges() {
    this.roleMapForm.controls['function_group'].valueChanges.subscribe((value) => {
      // this.setValidity(value);
      if (value) {
        this.changeGroup(value);
      }else {
        this.subFunctionData =  [{
          sub_function_grp_id: '',
          sub_function_grp_name: '-- Select Sub Function --'
        }];
      }
    });
    this.roleMapForm.controls['region'].valueChanges.subscribe((value) => {
      if (value) {
        this.getAllDevisions(value);
      }else {
        this.divisionsData =  [{
          division_id: '',
          division_name: '-- Select division --',
          region_id: 0
        }];
      }
    });
  }

  public getAllEmployeeDetails() {
    let allEmp = this.storage.getSession('allemp');
    this.configAllEmpData = allEmp;
    this.setDataSource();
  }
  public setDataSource() {
    this.dataSource = Observable.create((observer: any) => {
      observer.next(this.roleMapForm.value.sponsor);
    }).mergeMap((token: string) => this.getStatesAsObservable(token));
  }
  public getStatesAsObservable(token: string): Observable<any> {
    let query = new RegExp(token, 'ig');
    return Observable.of(
      this.configAllEmpData.details.filter((state: any) => {
        return query.test(state.empName);
      })
    );
  }

  public removeSlUsers(index, arr, type) {
    arr.splice(index, 1);
    this.roleModel = [];
  }
  public getRoles() {
    this.dataService.getRoles().subscribe((data) => {
      this.allRolesData = data;
      this.allRolesDataOptions = JSON.parse(JSON.stringify(data.details));
    });
  }

  public saveMapRole() {
  }
  public onSearch(event) {
    this.allRolesDataOptions = this.commonService.filterMultiSelectData(this.allRolesData.details, event.filter, 'roleName');
  }

  public onSubmit() {
    if (this.roleMapForm.valid) {
      this.formObject = this.roleMapForm.value;
      const saveObj = this.mapSaveObj(this.formObject);
      this.dataService.saveSponsorDetails(saveObj).subscribe((data) => {
        this.bsModalRef.hide();
        setTimeout(() => {
          let msg = {
            status: true,
            title: data.actionStatus ? 'Success' : 'Error', //actionStatus errorMessage
            type: data.actionStatus ? 'success' : 'danger',
            msg: data.actionStatus ? 'Saved successfully' : data.errorMessage
          };
          //this.commonService.addChargeCodeSuccess.emit(msg);
          this.modalService.onHidden.emit(msg);
        }, 600);
      });
    }
  }

  private mapSaveObj( formObj: any ) {
    let obj = {
      details: [],
      actionStatus: true,
      errorMessage: null
    };
    let saveObj = {
      // role_id: formObj.role[0].id,
      // app_id: formObj.application,
      // sponsorlist_id: '',
      sponsorlist_regionId: formObj.region,
      sponsorlist_divisionId: formObj.divisions,
      sponsorlist_subFunctionGroupId: formObj.sub_function,
      sponsorlist_empId: formObj.sponsor[0].userId ? formObj.sponsor[0].userId :  formObj.sponsor[0].id,
     // sponsorlist_empName: formObj.sponsor[0].text,
      // sponsorlist_functionGroupId: formObj.function_group
    };
    // if (formObj.role[0].text === 'ChargeCodeSponsor' ) {
    //   obj.details[0] = Object.assign(saveObj, {
    //     user_id: formObj.sponsor[0].id
    //   });
    // }
    if (this.rowData) {
      saveObj['sponsorlist_id'] = this.rowData.sponsorlist_id;
    }
    obj.details[0] = saveObj;
    return obj;
  }
  private getAllRolesUsers() {
    this.busy = this.dataService.getAllRoleMaps().subscribe((data) => {
      this.AllRolesUsers = data;
      let adminRoles = this.AllRolesUsers.details.filter( o => o.role_name === 'ChargeCodeAdmin').map( o => o.user_id)
      this.formObjects.sponsor[1].push(this.commonService.adminRoleCheck(adminRoles, 'id'));
      this.buildForm(this.formObjects);
    }, (err) => {
      console.log(err);
    });
  }
  private onEditView( obj ) {
   // console.log(obj);
    this.roleMapForm.patchValue({
      sponsor: [{userId: obj.sponsorlist_empId, empName: obj.user_name}],
      function_group: obj.function_grp_id,
      sub_function: obj.sponsorlist_subFunctionGroupId,
      region: obj.sponsorlist_regionId,
      divisions: obj.sponsorlist_divisionId
    });
   // console.log(this.roleMapForm);
  }
}

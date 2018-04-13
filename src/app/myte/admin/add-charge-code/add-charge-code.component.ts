import {Component, OnInit, AfterViewInit, HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Ng2Storage } from './../../../service/storage';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

import {
  ChargeCodeDetails,
  AllFunctionGroupData,
  AllFunctionGroups, AllChargeCodes,
  AllChargeCodeTypesData,
  AllRegionsData, AllRegions,
  AllDivisions,
  AllDivisionsData,
  ChargeCodeDetailsData,
  PeriodData,
  EmployeeData,
  EmployeeDetails, SponsorList, AllUsersWithRoles, AllSubFunctionGroupData
} from '../../../app.interface';
import { Subscription } from 'rxjs/Subscription';
import { compact, find, uniqBy } from 'lodash';
import { DataService } from '../../../service/DataService';
import { CommonService } from '../../../service/common.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {containsTree} from '@angular/router/src/url_tree';

@Component({
  selector: 'app-add-charge-code',
  templateUrl: './add-charge-code.component.html',
  styleUrls: ['./add-charge-code.component.css']
})
export class AddChargeCodeComponent implements OnInit, AfterViewInit {

  public title: string;
  public functionGroups: AllFunctionGroupData[];
  public configAllEmpData: EmployeeData;
  public trSubmitToList: EmployeeDetails[] = [];
  public trSubmitToListModel: EmployeeDetails[] = [];
  public AllRolesUsers: AllUsersWithRoles;

  public isGenerate = false;
  public generateTxt = '';

  public rowData: ChargeCodeDetailsData;
  public sponsorsList: SponsorList;
  public asyncSelected: string;
  public typeaheadLoading: boolean;
  public typeaheadNoResults: boolean;
  public dataSource: Observable<any>;
  public isNumber: boolean = true;
  private chargeCodeData: string[];
  public  isSelectedChargeCode: boolean = false;
  public isDuplicateCharCode: boolean = false;

  public subFunctionData: AllSubFunctionGroupData[] = [{
    sub_function_grp_id: '',
    sub_function_group_code: '',
    sub_function_grp_name: '-- Select Sub Function --'
  }];
  private chargeCodeString:string[] = [];
  public chargeCodeStringModel:string;
  public regions: AllRegionsData[] = [{
    region_id: '',
    region_name: '-- Select Region -- '
  }];
  public status: { isopen: boolean } = { isopen: false };

  public isDatePickerOpen = false;
  public chargeCodeTypeData: AllChargeCodeTypesData[] = [{
    charge_code_types_id: 0,
    charge_code_types_Fun_Code: '',
    charge_code_type: '',
    charge_code_type_char: '',
    charge_code_type_grpno: 0
  }];
  public subChargeCodeTypeData: string[] = [''];
  public divisionsData: AllDivisionsData[] = [{
      division_id: '',
      division_name: '-- Select division --',
      region_id: 0
  }];

  private statusBtnRetire = {name: 'Retired', value: 'retired'};
  public statusBtn = [
    {name: 'Active', value: 'Active'},
    {name: 'In Active', value: 'Inactive'}
  ];
  private sponsorId: string;
   public mySettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true,
    isIdShow: false
  };
  public myTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: '-- Select Owner --',
    allSelected: 'All selected',
  };

  public datePickObj: any;
  public datePickObjAll: PeriodData;
  public accountIdData: string[] = [''];
  private isNotDelivery = ['business_unit','delivery_unit','account_id','charge_code_type','charge_code_subtype','client'];
  private keyCodes = [15,48,49,50,51,52,53,54,55,56,57,6,96,97,98,99,100,101,102,103,104,105,38,40,8,9,37,39,110,190,46];

  public addAssignment: FormGroup;
  public iFormValid: boolean = true;
  public editData: boolean = false;
  public editPopup: Subscription;
  public busy: Subscription;
  private selectedSubFunc: string;
  private ccDescription = [];
  public parentChargeCodeList = ['Self'];
  public isChargeCodeTypeRoot = false;

  selectedItems = [];
  settings = {};

  public formObject: any = {
    function_group: '',
    sub_function: '',
    region: '',
    divisions: '',
    charge_code_type: '',
    charge_code: undefined,
    full_year: new Date().getFullYear(),
    charge_code_id: undefined,
    charge_code_parent: 'Self',
    charge_code_parent_desc: '',
    charge_code_description: undefined,
    charge_code_owner: this.trSubmitToListModel,
    stEndDate: null,
    status: 'Active',
    chargeableHour: '',
    sponsor: ''
  };

  private validationMessages = {
    'function_group':        {
      'required':  'Function Group is required.'
    },
    'sub_function':        {
      'required':  'Sub Function is required.'
    },
    'region':        {
      'required':  'Region is required.'
    },
    'divisions':        {
      'required':  'Division is required.'
    },
    'charge_code_type':        {
      'required':  'Charge code sub type is required.'
    },
    'full_year':        {
      'required':  'Year is required.'
    },
    'charge_code': {
      'required':  'Please Generate Charge Code'
    },
    'charge_code_parent': {
      'required':  'Parent charge code is required'
    },
    // 'charge_code_parent_desc': {
    //   'required':  'Parent charge code description is required'
    // },
    'charge_code_description':        {
      'required':  'Charge Code Description is required.',
      'duplicateDesc': 'Duplicate charge code description is not allowed'
    },
    'charge_code_owner':        {
      //  'required':  'Charge Code Owner is required.',
      'adminRole': 'Selected user cannot be Sponsor/Owner'
    },
    'stEndDate':        {
      'required':  'Start and End Date is required.',
      'dateFormat' : 'Date should be Start and End date format '
    },
    'status':        {
      'required':  'Status is required.'
    },
    // 'chargeableHour': {
    //   'required':  'Chargeable Hours is required.'
    // },
    'sponsor': {
      'required': 'Sponsor is required'
    }
  }

  public formErrors = {
    function_group: '',
    sub_function: '',
    region: '',
    divisions: '',
    charge_code_type: '',
    charge_code: '',
    charge_code_parent: '',
    charge_code_parent_desc: '',
    full_year: '',
    charge_code_description: '',
    charge_code_owner: '',
    stEndDate: '',
    status: '',
    //chargeableHour: '',
    sponsor: ''
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
    charge_code_type: [
      this.formObject.charge_code_type,
      [Validators.required]
    ],
    full_year: [
      this.formObject.full_year,
      [Validators.required]
    ],
    charge_code: [
      this.formObject.charge_code,
      [Validators.required]
    ],
    charge_code_parent: [
      this.formObject.charge_code_parent,
      [Validators.required]
    ],
    // charge_code_parent_desc: [
    //   this.formObject.charge_code_parent_desc,
    //   [Validators.required]
    // ],
    charge_code_description: [
      this.formObject.charge_code_description,
      [Validators.required]
    ],
    charge_code_owner: [
      this.formObject.charge_code_owner,
      []
    ],
    stEndDate: [
      this.formObject.stEndDate,
      [Validators.required, this.commonService.dateFromatValidation()]
    ],
    status: [
      this.formObject.status,
      [Validators.required]
    ],
    chargeableHour: [
      this.formObject.chargeableHour
    ],
    sponsor:[
      this.formObject.sponsor,
      [Validators.required]
    ]
  };
  private isExistCD = '';

  @HostListener('document:click', ['$event'])
  onDocumentClick(e) {
    if (e.target && e.target.id === 'stEndDate') {
      this.status.isopen = true;
    }else {
      this.status.isopen = false;
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private dataService: DataService,
    public bsModalRef: BsModalRef,
    private storage: Ng2Storage,
    private commonService: CommonService,
    private modalService: BsModalService) {}

  public ngOnInit() {
    this.settings = {
      text: 'Select Countries',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: 'myclass custom-class'
    };

    this.datePickObj = this.storage.getSession('periods').currentPeriodDetailsBean.timePeriodLastdate;
    this.datePickObjAll = this.storage.getSession('periods');
    this.getAllRolesUsers();
    this.getAllEmployeeDetails();
    this.getSposors();
    this.chargeCodeString[0] = '--';
    this.chargeCodeString[1] = new Date().getFullYear().toString().substr(-2);

    let chargeCode = this.storage.getSession('charge_codes').map( o => o.charge_code_description.toLowerCase());
    this.formObjects.charge_code_description[1].push(this.commonService.duplicateChargeCodeDescription(chargeCode, this.isExistCD));
    this.buildForm(this.formObjects);

    this.getFuncdtionGroup();

    this.getAllRegions();

    //this.chargeCodeStringModel = this.chargeCodeString.toString().replace(/[,]/g, '');
    this.chargeCodeStringModel = '';
  }


  public ngAfterViewInit() {
    setTimeout(() => {
      if (this.rowData) {
        this.getEditData();
      }
    }, 100);
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  private getSposors() {
    this.dataService.getSponsorList().subscribe((data) => {
      let obj = {
        sponsorlist_divisionId: '0',
        sponsorlist_empId: '',
        sponsorlist_empName: '-- Select Sponsor --',
        sponsorlist_id: 0,
        sponsorlist_regionId: '',
        sponsorlist_subFunctionGroupId: '0'
      };
      data.details.unshift(obj);

      this.sponsorsList = data;
    }, (err) => {
      console.log(err);
    });
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
  private getAllChargecodes( subFunGrpId) {
    this.busy = this.dataService.getAllChargeCodetypes(subFunGrpId).subscribe((data: AllChargeCodes) => {
      if (data.details) {
        data.details.unshift({
          charge_code_types_id: 0,
          charge_code_types_Fun_Code: '',
          charge_code_type: '',
          charge_code_type_char: '',
          charge_code_type_grpno: 0
        });
      }
        this.chargeCodeTypeData = uniqBy(data.details, 'charge_code_type');
      setTimeout(() => {
        if (this.rowData) {
          this.addAssignment.patchValue({
            charge_code_type: this.rowData.charge_code_type
          });
        }
      }, 500);
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

  public getAllDevisions( id) {
    this.busy = this.dataService.getAlldivisions( id).subscribe((data: AllDivisions)=>{
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
  public buildForm( objs: any):void {
    this.addAssignment = this.formBuilder.group(objs);
    this.addAssignment.valueChanges.subscribe(data => this.onValuesChanged());
    this.onValuesChanged();
    this.selectedValueChanges();
  }


  public ngOnDestroy() {
   // this.editPopup.unsubscribe();
  }

  public onValuesChanged(data?: any) {
    if (!this.addAssignment) { return; }
    const form = this.addAssignment;
    for(const field in this.formErrors) {
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

  public onSubmit() {
    //console.log(this.addAssignment)
    // console.log(this.addAssignment.getRawValue());
    // let chargeCode1 = this.storage.getSession('charge_codes').map( o => o.charge_code_description.toLowerCase());
    //
    // this.addAssignment.controls['charge_code'].setValidators([Validators.required, this.commonService.duplicateChargeCodeDescription(chargeCode1, this.isExistCD)]);
    // this.addAssignment.controls['charge_code'].updateValueAndValidity();
    // this.addAssignment.updateValueAndValidity();

    if (this.addAssignment.valid) {
      //let chargeCode = this.chargeCodeStringModel + this.addAssignment.value.charge_code;
      let chargeCode = this.chargeCodeStringModel + this.addAssignment.getRawValue().charge_code;
      if (this.chargeCodeData.indexOf(chargeCode) > 0 && !this.rowData) {
        this.isDuplicateCharCode = true;
      }else {
        this.isDuplicateCharCode = false;
        this.formObject = this.addAssignment.getRawValue();
        let saveObj = this.mapSaveObj(this.formObject);
        this.busy = this.dataService.saveChargeCodeDetails(saveObj).subscribe((data) => {
          this.bsModalRef.hide();
          // if(data.actionStatus){
          // }
            setTimeout(() => {
            let msg = {
              status: true,
              title: 'Success',
              type: 'success',
              msg: 'Saved successfully'
            };
            //this.commonService.addChargeCodeSuccess.emit(msg);
            this.modalService.onHidden.emit(msg);
          }, 600);
        }, (err) => {
          console.log('ERROR', err);
          this.bsModalRef.hide();
          setTimeout(() => {
            let msg = {
              status: true,
              title: 'Error',
              type: 'danger',
              msg: 'Internal server error while saving'
            };
            //this.commonService.addChargeCodeSuccess.emit(msg);
            this.modalService.onHidden.emit(msg);
          }, 600);
        });
      }
    } else {
    }
  }
  public mapSaveObj( obj ) {

    let objs: any = {
      details: this.getSaveObj(obj),
      actionStatus: true,
      errorMessage: null
    };
    if (this.editData) {
      objs.details[0].charge_code_id = this.rowData.charge_code_id;
    }
    return objs;
  }
  private getSubFunctionGruopCode( str ) {
    var val = parseInt(str, 10);
    return find(this.subFunctionData, function(o) { return o.sub_function_grp_id == val; });
  }
  private getSaveObj( obj: any) {
    let division: AllDivisionsData = find(this.divisionsData, function(o) { return o.division_id ===  +obj.divisions; });
    let region: AllRegionsData = find(this.regions, function(o) { return o.region_id ===  +obj.region ;});
    let function_grp_name: AllFunctionGroupData = find(this.functionGroups, function(o) { return o.function_grp_id ===  +obj.function_group; });
    let chargeCodeType = find(this.chargeCodeTypeData, function(o) { return o.charge_code_type ===  obj.charge_code_type; });
    let sub_function: AllSubFunctionGroupData = this.getSubFunctionGruopCode(obj.sub_function);
    let stDate: Date = new Date(obj.stEndDate.split(' - ')[0]);
    let endDate: Date = new Date(obj.stEndDate.split(' - ')[1]);
    let createDate = new Date();
    let dateFormat = Date.parse(`${createDate.getFullYear()}-${createDate.getMonth() + 1}-${createDate.getDate()} ${createDate.getHours()}:${createDate.getMinutes()}:${createDate.getSeconds()}`);
    let arr = [];
    let owners =  obj.charge_code_owner.length > 0 ? obj.charge_code_owner.map( o => o.userId).toString() : '';

      arr[0] = {
       charge_code: obj.charge_code, // this.chargeCodeStringModel + obj.charge_code,
       charge_code_description: obj.charge_code_description,
       charge_code_owner: `${owners ? owners : ''}${owners.indexOf(obj.sponsor) > -1 ? '' : ',' + obj.sponsor }`,
       sub_function_grp_id: obj.sub_function,
       charge_code_type_id: chargeCodeType.charge_code_types_id,
       charge_code_parent: obj.charge_code_parent === 'Self' ? obj.charge_code : obj.charge_code_parent,
      // charge_code_type: chargeCodeType.charge_code_type_desc,
      // charge_code_subtype: obj.charge_code_type,
       client: null,
       country: null,
       bu_id: region.region_id,
       //bu_name: region.region_name,
       du_id: division.division_id,
       //du_name: division.division_name,
       project: null,
       year: obj.full_year,
       function_grp_id: function_grp_name.function_grp_id,
      // function_grp_name: function_grp_name.function_grp_name,
      // owner: owners,
       sponsor: obj.sponsor,
       //sponsor: this.sponsorId,
       valid_from: Date.parse(`${stDate.getMonth() + 1}/${stDate.getDate()}/${stDate.getFullYear()}`),
       valid_to: Date.parse(`${endDate.getMonth() + 1 }/${endDate.getDate()}/${endDate.getFullYear()}`),
       status: obj.status,
       created_date: dateFormat,
       chargeable_hours: +obj.chargeableHour,
       retired_date: obj.status === 'retired' ? dateFormat : null

   };
    return arr;
  }
  private setValidity( val: any) {

      for (var i = 0; i < this.isNotDelivery.length; i++) {
        let data = this.isNotDelivery[i]
        if(val != 1){
        this.addAssignment.controls[data].clearValidators();
        this.addAssignment.controls[data].updateValueAndValidity();
        this.addAssignment.updateValueAndValidity();
      }else{
        this.addAssignment.controls[data].setValidators([Validators.required]);
        this.addAssignment.controls[data].updateValueAndValidity();
        this.addAssignment.updateValueAndValidity();
      }
    }
  }
  public backToChargeCode() {
    //this.route.navigate(['/app'])
    this.bsModalRef.hide();
  }

  public changeGroup( data) {
    let id = parseInt(data, 10);
    this.busy = this.dataService.getAllSubFunctionGroups(id).subscribe(( obj ) => {
      obj.details.unshift({
        sub_function_grp_id: '',
        sub_function_group_code: '',
        sub_function_grp_name: '-- Select Sub Function --'
      });
      this.subFunctionData = obj.details;

      if (this.rowData) {
        let subFuncObj = this.getSubFunctionGruopCode(this.rowData.sub_function_grp_id);
        this.selectedSubFunc = subFuncObj ? subFuncObj.sub_function_group_code : '' ;
        this.ccDescription[0] =  this.selectedSubFunc;
        this.getAllChargecodes(this.selectedSubFunc);
        this.getChargeCodeParentList(subFuncObj.sub_function_grp_id);
      }else {
        this.selectedSubFunc = '';
        this.chargeCodeTypeData = [{
          charge_code_types_id: 0,
          charge_code_types_Fun_Code: '',
          charge_code_type: ' -- Select Charge Code Type --',
          charge_code_type_char: '',
          charge_code_type_grpno: 0
        }];
        this.ccDescription[0] = '';
      }
    });
  }
  // public changeSubFunction( data) {
  //   let id = parseInt(data, 10);
  //   this.busy = this.dataService.getAllSubFunctionGroups(id).subscribe(( obj ) => {
  //     obj.details.unshift({
  //       sub_function_grp_id: '',
  //       sub_function_group_code: '',
  //       sub_function_grp_name: '-- Select Sub Function --'
  //     })
  //     this.subFunctionData = obj.details;
  //   });
  // }
  public stopString(evt) {
    var keyCode = evt.keyCode ? evt.keyCode : evt.which;
    if ((this.keyCodes.indexOf(keyCode) == -1  && !evt.shiftKey) ||  (this.keyCodes.indexOf(keyCode) !== -1  && evt.shiftKey)) {
      evt.stopPropagation();
      return false;
    }
  }
  public stopClosing( evt: Event) {
    evt.stopImmediatePropagation();
  }
  private selectedValueChanges() {
    this.addAssignment.controls['function_group'].valueChanges.subscribe((value) => {
     // this.setValidity(value);
      this.isSelectedChargeCode = false;
      this.formErrors.charge_code = '';
      this.generateTxt = '';
     if (value) {
      this.changeGroup(value);
     }else {
      this.subFunctionData =  [{
        sub_function_grp_id: '',
        sub_function_group_code: '',
        sub_function_grp_name: '-- Select Sub Function --'
      }];
     }
    });
    this.addAssignment.controls['region'].valueChanges.subscribe((value) => {
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
    this.addAssignment.controls['full_year'].valueChanges.subscribe((value) => {
      this.generateTxt = '';
      if (value && value.length > 3) {
        this.chargeCodeString[1] = value.substr(-2);
        this.chargeCodeStringModel = this.chargeCodeString.toString().replace(/[,]/g, '');
      }else {
        this.chargeCodeString[1] = new Date().getFullYear().toString().substr(-2);
        this.chargeCodeStringModel = this.chargeCodeString.toString().replace(/[,]/g, '');
      }
      this.addAssignment.patchValue({
        charge_code: ''
      });
      if (this.rowData) {
        this.chargeCodeStringModel = this.rowData.charge_code;
      }
    });
    this.addAssignment.controls['charge_code'].valueChanges.subscribe((value) => {
      this.isDuplicateCharCode = false;
    });

    this.addAssignment.controls['sub_function'].valueChanges.subscribe((value) => {
      if (value) {
        let subFuncObj = this.getSubFunctionGruopCode(value);
        this.selectedSubFunc = subFuncObj ? subFuncObj.sub_function_group_code : '' ;
        this.ccDescription[0] =  this.selectedSubFunc;
        this.getAllChargecodes(this.selectedSubFunc);
        let ids = subFuncObj ? subFuncObj.sub_function_grp_id : '';
        this.getChargeCodeParentList(ids);
      }else {
        this.selectedSubFunc = '';
        this.chargeCodeTypeData = [{
          charge_code_types_id: 0,
          charge_code_types_Fun_Code: '',
          charge_code_type: ' -- Select Charge Code Type --',
          charge_code_type_char: '',
          charge_code_type_grpno: 0
        }];
        this.ccDescription[0] = '';
      }
      this.addAssignment.patchValue({
        charge_code_description: this.ccDescription.join('')
      });

      if (this.selectedSubFunc) {
        this.chargeCodeString[0] = this.selectedSubFunc;
        this.chargeCodeStringModel = this.chargeCodeString.toString().replace(/[,]/g, '') ;

      }else {
        this.chargeCodeString[0] = '-- ';
        this.chargeCodeStringModel = this.chargeCodeString.toString().replace(/[,]/g, '') ;
      }
      this.addAssignment.patchValue({
        charge_code: ''
      });
      if (this.rowData) {
        this.chargeCodeStringModel = this.rowData.charge_code;
      }
      if (!this.rowData) {
        this.addAssignment.patchValue({
          charge_code_description: this.ccDescription.join('')
        });
      }else {
        this.addAssignment.patchValue({
          charge_code_description: this.rowData.charge_code_description
        });
      }
    });
    this.addAssignment.controls['charge_code_type'].valueChanges.subscribe((value) => {
      if (value === 'Root') {
        this.isChargeCodeTypeRoot = true;
        this.addAssignment.patchValue({
          charge_code_owner: []
        })
      }else {
        this.isChargeCodeTypeRoot = false;
      }

      if (value) {
        this.ccDescription[1] =  value;
      }else {
        this.ccDescription[1] =  '';
      }
      if (!this.rowData) {
        this.addAssignment.patchValue({
          charge_code_description: this.ccDescription.join('')
        });
      }else {
        this.addAssignment.patchValue({
          charge_code_description: this.rowData.charge_code_description
        });
      }
     // this.chargeCodeStringModel = this.chargeCodeString.toString().replace(/[,]/g, '');
      this.generateTxt = '';
    });
    // this.addAssignment.controls['charge_code_type'].valueChanges.subscribe((value) => {
    //   if (value) {
    //     let obj = find(this.chargeCodeTypeData, function(o) { return o.charge_code_type_id ==  value;});
    //     this.chargeCodeString[1] = obj.charge_code_type_desc.slice(0,1);
    //     this.chargeCodeStringModel = this.chargeCodeString.toString().replace(/[,]/g, '');
    //    }else{
    //     this.chargeCodeString[1] = '-';
    //     this.chargeCodeStringModel = this.chargeCodeString.toString().replace(/[,]/g, '');
    //     this.divisionsData =  [{
    //       division_id: '',
    //       division_name: '-- Select division --',
    //       region_id: 0
    //     }];
    //    }
    // });

  }
  public onFocusDate(evt) {
    evt.stopPropagation();
    this.status.isopen = true;
  }

  public changeDate( obj) {
    this.addAssignment.patchValue({
      stEndDate: obj.dateModel
    });
    if (obj.dateFullFill) {
      this.status.isopen = !this.status.isopen;
      this.isDatePickerOpen = false;
    }
  }
  public changeDatePick( value) {
    this.status.isopen = value;
    this.isDatePickerOpen = value;
  }

  public getAllEmployeeDetails() {
    let allEmp = this.storage.getSession('allemp');
    allEmp.details = allEmp.details.map((o, ind) => {
      o['id'] = ind;
      o['itemName'] = o.empName;
      return o;
    });
    this.configAllEmpData = allEmp;
    this.trSubmitToList = allEmp.details;
    this.setDataSource();
  }
  public setDataSource() {
    this.dataSource = Observable.create((observer: any) => {
      observer.next(this.addAssignment.value.sponsor);
    }).mergeMap((token: string) => this.getStatesAsObservable(token));
  }
  public getStatesAsObservable(token: string): Observable<any> {
    let query = new RegExp(token, 'ig');
    return Observable.of(
      this.sponsorsList.details.filter((state: any) => {
        return query.test(state.empName);
      })
    );
  }
  public changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  public changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log(e);
    this.sponsorId = e.item.sponsorlist_empId;

    let ind = e.value.indexOf(' - ');
    let val2 = e.value.toString().slice(ind + 2);
    this.addAssignment.patchValue({
      sponsor: val2
    });
  }
  public onSearch(event, name) {
    this.trSubmitToList = this.commonService.filterMultiSelectData(this.configAllEmpData.details, event.filter, 'userName');
  }
  public getTimeReport2(name) {
    //this.addAssignment.value.
    this.addAssignment.value.charge_code_owner = name;
  }

  public generateChargeCode() {

    var cct = this.addAssignment.value.charge_code_type;
    if (!cct) {
      return;
    }
    let fg = this.chargeCodeString[0];
    let yr = this.chargeCodeString[1];
    if (fg === '--') {
      this.isSelectedChargeCode = true;
      this.formErrors.charge_code = 'Please Select Function Group';
      return;
    }
    this.isSelectedChargeCode = false;
    this.formErrors.charge_code = '';
    this.isGenerate = true;
    this.generateTxt = 'Generating...';


    this.dataService.getGenerateChargeCode(this.selectedSubFunc, yr, cct).subscribe((data) => {
      this.chargeCodeStringModel = data.details;
      this.generateTxt = 'Generated';
      this.addAssignment.patchValue({
        charge_code: this.chargeCodeStringModel
      });
    }, (err) => {
      this.generateTxt = 'Failed';
    });
  }

  private getEditData() {

    let charge_code = this.rowData.charge_code.slice(this.rowData.charge_code.length - 4);
    let ownes = this.rowData.charge_code_owner_emp.split(',');

    let emplData = this.commonService.ObjectToJsonToObject(this.configAllEmpData.details.filter(( obj ) => {
        return ownes.indexOf(obj.userId) !== -1;
    }));
    this.chargeCodeStringModel = this.rowData.charge_code;
    let stDate = new Date(this.rowData.valid_from);
    let endDate = new Date(this.rowData.valid_to);
    let date = `${stDate.getMonth() + 1}/${stDate.getDate()}/${stDate.getFullYear()} - ${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`;

    this.sponsorId = this.rowData.sponsor_id;
    this.addAssignment.patchValue({
      function_group: this.rowData.function_grp_id,
      sub_function: this.rowData.sub_function_grp_id,
      region: this.rowData.region_id,
      divisions: this.rowData.division_id,
      charge_code: this.rowData.charge_code,
      full_year: this.rowData.year,
      charge_code_description: this.rowData.charge_code_description,
      charge_code_owner: emplData,
      stEndDate: date,
      status: this.rowData.status,
      chargeableHour: this.rowData.chargeable_hours,
      sponsor: this.rowData.sponsor_id,
      year: this.rowData.year,
      charge_code_parent: this.rowData.charge_code_parent,
      charge_code_type: this.rowData.charge_code_type
    });
    this.editData = true;
    this.datePickObj = this.rowData.valid_from;
    let fields = ['function_group', 'region', 'divisions', 'sub_function', 'full_year', 'charge_code_parent', 'charge_code_type'];
    this.commonService.disabledReactiveFormFields(this.addAssignment, fields);
    this.addAssignment.patchValue({
      charge_code: this.rowData.charge_code
    });
    this.isExistCD = this.rowData.charge_code_description;

    this.addAssignment.controls['charge_code_description'].clearValidators();
    this.addAssignment.controls['charge_code_description'].updateValueAndValidity();
    setTimeout(() => {
      let chargeCode = this.storage.getSession('charge_codes').map( o => o.charge_code_description.toLowerCase());

      this.addAssignment.controls['charge_code_description'].setValidators([Validators.required, this.commonService.duplicateChargeCodeDescription(chargeCode, this.isExistCD)]);
        this.addAssignment.controls['charge_code_description'].updateValueAndValidity();
        this.addAssignment.updateValueAndValidity();
    }, 400);
  }



  private getAllRolesUsers() {
    this.busy = this.dataService.getAllRoleMaps().subscribe((data) => {
      this.AllRolesUsers = data;
      let adminRoles = this.AllRolesUsers.details.filter( o => o.role_name === 'ChargeCodeAdmin').map( o => o.user_id)
      this.formObjects.charge_code_owner[1].push(this.commonService.adminRoleCheck(adminRoles, 'userId'));
      this.buildForm(this.formObjects);
    }, (err) => {
      console.log(err);
    });
  }

  private getChargeCodeParentList( subFun: string | number) {
    this.busy = this.dataService.getChargeCodeParentLists(subFun).subscribe((data) => {
      console.log(data);
      if (data.actionStatus) {
        data.details.unshift('Self');
        this.parentChargeCodeList = data.details;
      }else {
        console.log('There is no Data');
      }
    }, (e) => {
      console.log(e);
    });
  }


}

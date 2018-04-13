import {AfterViewInit, Component, OnInit, HostListener} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DataService } from '../../../service/DataService';
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../../../service/common.service';
import {LoginResponse, PeriodData} from '../../../app.interface';
import {Ng2Storage} from '../../../service/storage';
import {DatePipe} from '@angular/common';
@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit, AfterViewInit {

  public rowData: any;
  public createTaskForm: FormGroup;
  public busy: Subscription;
  public isDatePickerOpen = false;
  public datePickObj: any;
  public datePickObjAll: PeriodData;
  public chargeCodesData: string[] = [];
  public selectedChargeCodes: any[] = [];
  public disabled: boolean = false;
  public taskCode: string = '';
  public userData: LoginResponse;
  public isDateValidity: boolean = false;
  public title: string = '';
  public isGenerate = false;
  public generateTxt = '';
  public dateRange: string;
  public isChargeCodeSelected = false;
  private isExistCD = '';
  public statusBtn = [
    {name: 'Active', value: 'Active'},
    {name: 'In Active', value: 'Inactive'}
  ];

  public formObject: any = {
    charge_code: '',
    charge_code_task_code: '',
    charge_code_task_desc: '',
    charge_code_task_validity: '',
    charge_code_task_status: 'Active'
  };
  private validationMessages = {
    'charge_code':        {
      'required':  'Charge code is required.'
    },
    'charge_code_task_code':        {
      'required':  'Task code is required.'
    },
    'charge_code_task_desc':        {
      'required':  'Task code description is required.',
      'duplicateDesc': 'Duplicate task code description is not allowed'
    },
    'charge_code_task_validity': {
      'required':  'Task code period is required.',
      'dateFormat' : 'Date should be Start and End date format '
    },
    'charge_code_task_status': {
      'required':  'Task code status is required.'
    },
  };
  public formErrors = {
    charge_code: '',
    charge_code_task_code: '',
    charge_code_task_desc: '',
    charge_code_task_validity: '',
    charge_code_task_status: ''
  };
  private formObjects = {
    charge_code: [
      this.formObject.charge_code,
      [Validators.required]
    ],
    charge_code_task_code: [
      this.formObject.function_group,
      [Validators.required]
    ],
    charge_code_task_desc: [
      this.formObject.sub_function,
      [Validators.required]
    ],
    charge_code_task_validity: [
      this.formObject.charge_code_task_validity,
      [Validators.required, this.commonService.dateFromatValidation()]
    ],
    charge_code_task_status: [
      this.formObject.charge_code_task_status,
      [Validators.required]
    ]
  };
  public status: { isopen: boolean } = { isopen: false };

  @HostListener('document:click', ['$event'])
  onDocumentClick(e) {
      if (e.target && e.target.id === 'charge_code_task_validity') {
        this.status.isopen = true;
      }else {
        this.status.isopen = false;
      }
  }
constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private commonService: CommonService,
    private storage: Ng2Storage,
    private modalService: BsModalService,
    private datePipe: DatePipe) { }

  public ngOnInit() {
    this.datePickObj = this.storage.getSession('periods').currentPeriodDetailsBean.timePeriodLastdate;
    this.datePickObjAll = this.storage.getSession('periods');
    this.chargeCodesData = this.storage.getSession('charge_codes');
    this.userData = this.storage.getSession('user_data');
    let taskCode = this.storage.getSession('task_codes').map( o => o.charge_code_task_desc.toLowerCase());
    this.formObjects.charge_code_task_desc[1].push(this.commonService.duplicateChargeCodeDescription(taskCode, this.isExistCD));

    this.buildForm(this.formObjects);
    this.formFieldsChangeEvents();
  }
  public ngAfterViewInit() {
    setTimeout(() => {
      if (this.rowData) {
        console.log(this.rowData);
        this.onEditTask(this.rowData);
      }
    }, 400);
  }
  public buildForm( objs: any): void {
    this.createTaskForm = this.formBuilder.group(objs);
    this.createTaskForm.valueChanges.subscribe(data => this.onValuesChanged());
    this.onValuesChanged();
  }

  public onValuesChanged(data?: any) {
    if (!this.createTaskForm) { return; }
    const form = this.createTaskForm;
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
  public onSubmit() {
    if (this.createTaskForm.valid) {
      this.formObject = this.createTaskForm.getRawValue();
      let saveObj = this.mapSaveObj( this.formObject);
      this.busy = this.dataService.saveChargeCodeTaskDetailsById(saveObj).subscribe((data) => {
        this.bsModalRef.hide();
        setTimeout(() => {
          let msg = {
            status: true,
            title: 'Success',
            type: 'success',
            msg: 'Saved successfully'
          };
         //   this.commonService.addChargeCodeSuccess.emit(msg);
          this.modalService.onHidden.emit(msg);
        }, 400);
      }, (err) => {
        console.log('ERROR', err);
      });
    } else {
    }
  }
  private mapSaveObj( obj: any) {
    let stDate: Date = new Date(obj.charge_code_task_validity.split(' - ')[0]);
    let endDate: Date = new Date(obj.charge_code_task_validity.split(' - ')[1]);

    let objs = {
      details: [{
          charge_code_task_code: obj.charge_code_task_code,
          charge_code_task_desc: obj.charge_code_task_desc,
          charge_code_parent_id: !this.rowData ? obj.charge_code[0].id : this.rowData.charge_code_parent_id,
          charge_code_task_validfrom: Date.parse(`${stDate.getMonth() + 1}/${stDate.getDate()}/${stDate.getFullYear()}`),
          charge_code_task_validto: Date.parse(`${endDate.getMonth() + 1 }/${endDate.getDate()}/${endDate.getFullYear()}`),
          charge_code_task_status: obj.charge_code_task_status,
          charge_code_task_owner: this.userData.employeeId
      }],
      actionStatus: true,
      errorMessage: null
    };
    if (this.rowData) {
      objs.details[0]['charge_code_task_id'] = this.rowData.charge_code_task_id;
    }
    return objs;
  }
  public close() {
    this.bsModalRef.hide();
  }

  public onKeypUp( evt: any) {
    let val = evt.target;
    if (val && val.value) {
        val.value = val.value.toUpperCase();
    }
  }
  public stopString(evt) {
    let keyCode = evt.keyCode ? evt.keyCode : evt.which;
    let keys = this.commonService.getKeys(this.commonService.onlyStringKeys, this.commonService.actionKeys);
    if ((keys.indexOf(keyCode) === -1  && !evt.shiftKey) ||  (keys.indexOf(keyCode) !== -1  && evt.shiftKey)) {
      evt.stopPropagation();
      return false;
    }
  }
  public onFocusDate(evt) {
    evt.stopPropagation();
      this.status.isopen = true;
  }
  public onCloseDatepick() {
    this.status.isopen = false;
  }
  public stopClosing( evt: Event) {
    evt.stopImmediatePropagation();
  }
  public changeDate( obj) {
    this.createTaskForm.patchValue({
      charge_code_task_validity: obj.dateModel
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
  public selected(value: any): void {
    this.getDateRange(value);
    this.createTaskForm.patchValue({
      charge_code_task_code: ''
    });
    this.taskCode = '';
    this.isChargeCodeSelected = false;
    this.generateTxt = '';
  }
  private getDateRange( obj ) {
    let chargeCode = obj.text ? obj.text : obj.charge_code;
    let currentDate: any = this.chargeCodesData.find( (o: any) => o.charge_code === chargeCode );
    this.dateRange = `${this.datePipe.transform(currentDate.valid_from, 'd MMM y')} - ${this.datePipe.transform(currentDate.valid_to, 'd MMM y')}`;
    this.datePickObj = Date.parse(currentDate.valid_from);
    let stDate = new Date(currentDate.valid_from);
    let edDate = new Date(currentDate.valid_to);
    this.createTaskForm.patchValue({
      charge_code_task_validity: `${stDate.getMonth() + 1}/${stDate.getDate()}/${stDate.getFullYear()} - ${edDate.getMonth() + 1}/${edDate.getDate()}/${edDate.getFullYear()}`
    });
  }
  public onBodyClickStop(evt) {
    evt.stopImmediatePropagation();
  }
  public removed(value: any): void {
    this.createTaskForm.patchValue({
      charge_code_task_validity: '',
      charge_code_task_code: ''
    });
    this.taskCode = '';
    this.dateRange = '';
    this.isChargeCodeSelected = false;
    this.generateTxt = '';
  }
  public generateTaskCode() {
    let val = this.createTaskForm.value.charge_code[0].text;
    this.isGenerate = true;
    this.generateTxt = 'Generating...';
    this.dataService.getGenerateChargeTaskCode(val).subscribe((data) => {
      this.taskCode = data.details;
      this.isChargeCodeSelected = true;
      this.generateTxt = 'Generated';
      this.createTaskForm.patchValue({
        charge_code_task_code: data.details
      });
    }, (err) => {
      this.generateTxt = 'Failed';
      this.isChargeCodeSelected = false;
    });
  }
  private formFieldsChangeEvents() {
    this.createTaskForm.controls['charge_code'].valueChanges.subscribe((value) => {
      if (value.length !== 0) {
      }else {
        this.createTaskForm.patchValue({
          charge_code_task_code: ''
        });
        this.taskCode = '';
      }
    });
  }

  private onEditTask( data ) {
    const taskCodes = this.storage.getSession('task_codes');  //charge_code_task_code
    let taskCode = taskCodes.filter( o => o.charge_code_task_code !== data.charge_code_task_code).map( o => o.charge_code_task_desc.toLowerCase());
    this.formObjects.charge_code_task_desc[1][1] = this.commonService.duplicateChargeCodeDescription(taskCode, this.isExistCD);

    this.buildForm(this.formObjects);
    this.formFieldsChangeEvents();

    this.selectedChargeCodes = this.chargeCodesData.filter( (o: any) => o.charge_code === data.charge_code);
    //this.selectedChargeCodes = data.charge_code_task_code;
    let stDate = new Date(data.charge_code_task_validfrom);
    let edDate = new Date(data.charge_code_task_validto);
    this.createTaskForm.patchValue({
      charge_code: this.selectedChargeCodes,
      charge_code_task_code: data.charge_code_task_code,
      charge_code_task_desc: data.charge_code_task_desc,
      charge_code_task_validity: `${stDate.getMonth() + 1}/${stDate.getDate()}/${stDate.getFullYear()} - ${edDate.getMonth() + 1}/${edDate.getDate()}/${edDate.getFullYear()}`,
      charge_code_task_status: data.charge_code_task_status
    });
    this.taskCode = data.charge_code_task_code;
    this.disabled = true;
    this.datePickObj = data.charge_code_task_validfrom;
    this.createTaskForm.get('charge_code_task_validity').disable();
    // this.createTaskForm.controls.charge_code_task_validity.disable();
   // this.createTaskForm.controls.charge_code_task_validity.disable(true);
    this.isDateValidity = true;
    this.getDateRange(data);

  }

}

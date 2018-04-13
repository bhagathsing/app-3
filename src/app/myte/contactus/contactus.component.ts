import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {DataService} from '../../service/DataService';
import {Contacts, ContactsData} from '../../app.interface';
import {timepickerReducer} from 'ngx-bootstrap/timepicker/reducer/timepicker.reducer';
import {ConfirmComponent} from '../../common/confirm/confirm.component';


@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  @ViewChild(ConfirmComponent) public confirmModal: ConfirmComponent;
  public contactUsForm: FormGroup;
  private fileObj: any;
  public confirmPopupData: any;
  public formObject: any = {
    uname: '',
    uemailid: '',
    message: '',
    attachment: ''
  };
  public formErrors: any = {
    uname: '',
    uemailid: '',
    message: '',
    attachment: ''
  };

  private validationMessages = {
    'uname': {
      'required': 'User name is required.'
    },
    'uemailid': {
      'required': 'User email-id is required.'
    },
    'message': {
      'required': 'Message is required.'
    }
  };
  private formObjects = {
    uname: [
      this.formObject.uname,
      [Validators.required]
    ],
    uemailid: [
      this.formObject.uemailid,
      [Validators.required]
    ],
    message: [
      this.formObject.message,
      [Validators.required]
    ],
    attachment: [
      this.formObject.attachment
    ]
  };

  public fileLableText = 'Please choose a file on your computer.';
  constructor(private fb: FormBuilder, private commonService: CommonService, private dataService: DataService) { }

  ngOnInit() {
    this.confirmPopupData = this.commonService.setConfirmOptions('Success', 'Sent mail', 'Ok', '--', 'success');
    this.buildForm(this.formObjects);
  }
  public onChangeFile(evt) {
    let file = evt.target.files;
    this.fileLableText = file[0].name;

    if (file && file[0]) {
        this.fileObj = file[0];
    }
  }
  public buildForm( objs: any): void {
    this.contactUsForm = this.fb.group(objs);
    this.contactUsForm.valueChanges.subscribe(data => this.onValuesChanged());
    this.onValuesChanged();
    this.selectedValueChanges();
  }
  public onValuesChanged(data?: any) {
    if (!this.contactUsForm) { return; }
    const form = this.contactUsForm;
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
  private selectedValueChanges() {
    this.contactUsForm.controls['attachment'].valueChanges.subscribe((value) => {
      console.log(value);
    });
  }
  public onSubmit() {
    if (this.contactUsForm.valid) {
      let obj = this.commonService.ObjectToJsonToObject(this.contactUsForm.value);
      obj.attachment = this.fileObj;
      this.saveContact(obj);
    }
  }

  private saveContact( obj: ContactsData ) {
    let input = new FormData();
    input.append('attachment', this.fileObj);
    input.append('uname', obj.uname);
    input.append('uemailid', obj.uemailid);
    input.append('message',  obj.message);
    this.dataService.sendContactDetails( input ).subscribe((data) => {
      console.log(data);
      this.confirmModal.show(null)
        .then((): void => {
        }).catch(() => {
      });
    });
  }
}

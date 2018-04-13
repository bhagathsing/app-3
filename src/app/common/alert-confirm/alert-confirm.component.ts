import {Component, EventEmitter, OnInit, ViewEncapsulation} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-alert-confirm',
  templateUrl: './alert-confirm.component.html',
  styleUrls: ['./alert-confirm.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlertConfirmComponent implements OnInit {
  public title: string = 'Alert or Confirm';
  public message: string = 'Test alert or Conform popup';
  public btnOkLable = 'Ok';
  public btnCancelLable = 'Cancel';
  public isAlert = false;
  public type = 'warning';
  public btnClass = '';

  constructor(public bsModalRef: BsModalRef, private modalService: BsModalService) { }

  ngOnInit() {
    this.modalService['onConfirm'] = new EventEmitter();
  }
  public onConfirm() {
    this.bsModalRef.hide();
    this.modalService['onConfirm'].emit(true);
  }
  public onOkClick() {
    this.bsModalRef.hide();
  }
  public onCancel() {
    this.bsModalRef.hide();
  }
}

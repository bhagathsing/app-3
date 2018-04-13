import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {reject} from 'q';

@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.scss']
})
export class ModalPopupComponent implements OnInit {
  public _isShow: boolean = false;

  @Input() title: string = 'Confirm';
  @Input() msg: string;
  @Input() type: string;
  @Input() set isShow( isShow: boolean){
    this._isShow = isShow;
  }
  private sendConfirmResult: () => any;
  private sendCancelResult: () => any;

  constructor() { }

  ngOnInit() {
  }
  closeModal() {
    this.sendCancelResult();
  }
  public show(value?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // resolution of the promise needs to be defferred until the user clicks a button
      this.buildDialogResponses(resolve, reject);
      this._isShow = true;
    });
  }

  private buildDialogResponses(resolve, reject): any {
    this.sendConfirmResult = (): any => {
      this._isShow = false;
      resolve();
      return true;
    };
    this.sendCancelResult = (): any => {
      this._isShow = false;
      reject();
      return false;
    };
  }

  public onConfirmClick(event: Event): void {
    event.preventDefault();
    this.sendConfirmResult();
  }

  public onCancelClick(event: Event): void {
    event.preventDefault();
    this.sendCancelResult();
  }


}

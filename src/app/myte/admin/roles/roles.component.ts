import {Component, OnInit, ViewChild} from '@angular/core';
import {ChargeCodeDetails, ChargeCodeDetailsData, LoginResponse, SponsorGrid} from '../../../app.interface';
import {Subscription} from 'rxjs/Subscription';
import {CommonService} from '../../../service/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Ng2Storage} from '../../../service/storage';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {DataService} from '../../../service/DataService';
import {RoleMappingComponent} from './role-mapping/role-mapping.component';
import {ConfirmComponent} from '../../../common/confirm/confirm.component';
declare const $: any;
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  @ViewChild(ConfirmComponent) public confirmModal: ConfirmComponent;
  public headerRowHeight: number = 40;
  public bodyRowHeight: number = 30;
  public gridData: SponsorGrid;
  public busy: Subscription;
  public userData: LoginResponse;
  public selectedRow: ChargeCodeDetailsData;
  public bsModalRef: BsModalRef;
  public confirmPopupData: any;

  public gridHeaders: any[] = [
    {name: 'Employee Id', field: 'sponsorlist_empId', width: '100'},
    {name: 'Employee Name', field: 'user_name', width: '240'},
    {name: 'Designation', field: 'desg_name', width: '180'},
    {name: 'Region', field: 'region_name', width: '180'},
    {name: 'Division Name', field: 'division_name', width: '180'},
    {name: 'Function Group', field: 'function_grp_name', width: '180'},
    {name: 'Sub Function', field: 'sub_function_grp_name', width: '180'}
  ];

  public modalConfig = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  constructor(
    private route: Router,
    private routeActive: ActivatedRoute,
    private dataService: DataService,
    private storage: Ng2Storage,
    private commonService: CommonService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.userData =  this.storage.getSession('user_data');
    this.getRoleGridData();
    this.confirmPopupData = this.commonService.setConfirmOptions('Success', 'Success', 'Ok', '--', 'success');
    // this.commonService.addChargeCodeSuccess.subscribe(( data) => {
    // });
    this.modalService.onHidden.subscribe((data) => {
      if (data) {
        this.confirmPopupData = this.commonService.setConfirmOptions(data.title, data.msg, 'Ok', '--', data.type);
        this.confirmModal.show(null)
          .then((): void => {
            if (data.status) {
              $.fn.dataTableExt.sErrMode = 'throw';
              $('#tableGrid_123').DataTable().clear().destroy();
              this.getRoleGridData();
            }
          }).catch(() => {
        });
      }
    });

  }

  public refreshData() {
    $.fn.dataTableExt.sErrMode = 'throw';
    $('#tableGrid_123').DataTable().clear().destroy();
    this.getRoleGridData();
  }
  public getRoleGridData() {
    this.dataService.getSponsorListToGrid().subscribe( (data) => {
      this.gridData = data;
      let pageLengthArray1 = [10, 25, 50, -1];
      let sortOpt = this.userData.employeeRoleName === 'ChargeCodeAdmin' ?  0 : 1;
      pageLengthArray1.unshift(5);
      let pageLengthArray2 = [10, 25, 50, 'All'];
      pageLengthArray2.unshift(5);
      setTimeout(() => {
        $('#tableGrid_123').DataTable({
          'lengthMenu': [pageLengthArray1, pageLengthArray2 ],
          'order': [[ sortOpt, 'asc' ]]
        });
        $('#tableGrid_123_filter').find('.form-control').removeClass('input-sm');
        $('#tableGrid_123_length').find('.form-control').removeClass('input-sm');
      }, 10);
    });
  }

  public addRole( rowData?: any) {
    this.bsModalRef = this.modalService.show(RoleMappingComponent, this.modalConfig);
    this.bsModalRef.content.title = !rowData ? 'Add Role' : 'Edit Role';
    if (rowData) {
      this.bsModalRef.content.rowData = rowData;
    }
  }

}

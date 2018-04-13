import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { DataService } from './DataService';
import { Ng2Storage } from '../service/storage';
import * as util from '../common/utils/util';
import {
  ILogin, LoginResponse,
  ChargeCodeDetails, AllChargeCodes,
  AllFunctionGroups,
  AllSubFunctionGroups,
  AllRegions,
  AllDivisions,
  EmployeeData,
  LastLogin,
  PeriodData,
  ResourcesByChargeCode,
  AssignChargeCodes,
  ChargeCodeTask, GenerateChargeCode, SponsorList, TimePeriodsDetail, GenericObj, OwnerParamObj, Roles, AddSponsor, AllUsersWithRoles,
  TaskCodeEditSave, ChargeCodeParentList, Faqs, TreeList, Contacts
} from '../app.interface';
import { find } from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CommonService } from './common.service';


@Injectable()
export class LiveDataService extends DataService {

  //private readonly basePath = 'http://10.250.53.60:6969/chargecodemanagement/'; // This is for local // http://10.250.53.76:8077
  private readonly basePath = 'http://10.250.53.60:7111/'; // This is for local
  //private readonly basePath = '/chargecodemanagement/';            // This is for Production
  private readonly CCMUrl = 'ccm/';
  private readonly userLoginUrl = this.getBaseURI() + 'authenticate';
  private readonly ChargecodesDetails = this.getBaseURI() + 'chargecodesdetails';
  private readonly SavechargecodeDetails = this.getBaseURI() + 'savechargecodedetails';
  private readonly Allchargecodetypes = this.getBaseURI() + 'allchargecodetypes';
  private readonly Allfunctiongroups = this.getBaseURI() + 'allfunctiongroups';
  private readonly AllSubfunctiongroups = this.getBaseURI() + 'allsubfunctiongroups';
  private readonly Allregions = this.getBaseURI() + 'allregions';
  private readonly Alldivisions = this.getBaseURI() + 'alldivisions';
  private readonly allEmployeeDetails = this.getBaseURI() + 'allemps';
  private readonly LastLoginUrl = this.getBaseURI() + 'lastlogindate';
  private readonly AllTimePeriods = this.getBaseURI() + 'allperiods';
  private readonly Resourcesbychargecode = this.getBaseURI() + 'assignedgridview';
  private readonly AssignchargecodesUrl = this.getBaseURI() + 'assignchargecodes';
  private readonly Savechargecodetaskdetailsbyid = this.getBaseURI() + 'savechargecodetaskdetailsbyid';
  private readonly Setchargecodeactiveinactive = this.getBaseURI() + 'setchargecodeactiveinactive';
  private readonly GeneratechargecodeUrl = this.getBaseURI() + 'generatechargecode';
  private readonly GeneratechargetaskcodeUrl = this.getBaseURI() + 'generatechargetaskcode';
  private readonly GetsponsorlistUrl = this.getBaseURI() + 'getsponsorlist';
  private readonly AssignedpopupviewUrl = this.getBaseURI() + 'assignedpopupview';
  private readonly Setassignmentstatusbyid = this.getBaseURI() + 'setassignmentstatusbyid';
  private readonly Deleteassignmentstatusbyid = this.getBaseURI() + 'deleteassignmentstatusbyid';
  private readonly Updateownerinchargecode = this.getBaseURI() + 'updateownerinchargecode';
  private readonly RolesUrl = this.getBaseURI() + 'roles';
  private readonly ChargecodesdetailsSponsorAsOwner = this.getBaseURI() + 'chargecodesdetailsSponsorAsOwner';
  private readonly Updatesponosrdetails = this.getBaseURI() + 'updatesponosrdetails';
  private readonly Getsponsorlisttogrid = this.getBaseURI() + 'getsponsorlisttogrid';
  private readonly Getallrolemaps = this.getBaseURI() + 'getallrolemaps';
  private readonly Updateusertaskmap = this.getBaseURI() + 'updateusertaskmap';
  private readonly ChargeCodeParentLists = this.getBaseURI() + 'getChargeCodeParentList';
  private readonly FaqDetails = this.getBaseURI() + 'getFaqDetails';
  private readonly TtreelistUrl = this.getBaseURI() + 'gettreelist';
  private readonly ContactusUrl = this.getBaseURI() + 'contactus';


  private readonly REQUEST_HEADERS: Headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  private readonly REQUEST_OPTIONS: RequestOptionsArgs = new RequestOptions({headers: this.REQUEST_HEADERS});

  private getBaseURI() {
    return this.basePath + this.CCMUrl;
  }

  constructor(private http: Http, private storage: Ng2Storage, private commonService: CommonService) {
    super();
  }

  /**
   * Login user
   * @param obj { Object }
   */
  public loginUser(obj: ILogin): Observable<LoginResponse> {
    let req = JSON.stringify(obj);
    return this.http.post(this.userLoginUrl, req, this.REQUEST_OPTIONS)
      .map((reponse: Response) => {
        let resp: LoginResponse = reponse.json();
        if (resp.employeeId) {
          this.storage.setSession('user_data', {
            employeeId: resp.employeeId,
            employeeName: resp.employeeName,
            employeeRoleId: resp.employeeRoleId,
            employeeRoleName: resp.employeeRoleName,
            deliveryUnit: resp.deliveryUnit,
            menuList: resp.menuList
          });
        }
        return reponse.json();
      });
  }

  public getChargeCodesDetails(roleName: string, empId: string, isSponsorOwner?: boolean): Observable<ChargeCodeDetails> {
    let urls = isSponsorOwner ? `${this.ChargecodesdetailsSponsorAsOwner}?empId=${empId}&role=${roleName}` : `${this.ChargecodesDetails}?role=${roleName}&empId=${empId}`;
    return this.http.get(urls, this.REQUEST_OPTIONS)
      .map((resp: Response) => {
        let data: ChargeCodeDetails = resp.json();
        if (data.details) {
          data.details.forEach((obj) => {
            obj.isActive =  obj.status === 'active';
            // if (obj.charge_code_type_id === 1) {
            //   obj.charge_code_type = 'Expense';
            // } else {
            //   obj.charge_code_type = 'Revenue';
            // }
          });
        }
        return data;
      });
  }

  public saveChargeCodeDetails(obj: ChargeCodeDetails): Observable<ChargeCodeDetails> {
    return this.http.post(this.SavechargecodeDetails, obj, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }

  public getAllChargeCodetypes(subFunCode: string): Observable<AllChargeCodes> {
    return this.http.get(`${this.Allchargecodetypes}?subFunCode=${subFunCode}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }

  public getAllFunctionGroups(): Observable<AllFunctionGroups> {
    return this.http.get(this.Allfunctiongroups, this.REQUEST_OPTIONS)
      .map((resp: Response) => {
        let data: AllFunctionGroups = resp.json();
        data.details.forEach((obj, ind) => {
          obj.shortCutName = this.commonService.shortCutFunctionGruop[ind];
        });
        return data;
      });
  }

  public getAllSubFunctionGroups(functionGrpId: number | string): Observable<AllSubFunctionGroups> {
    return this.http.get(`${this.AllSubfunctiongroups}?functionGrpId=${functionGrpId}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }

  public getAllregions(): Observable<AllRegions> {
    return this.http.get(`${this.Allregions}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }

  public getAlldivisions(regionId: string | number): Observable<AllDivisions> {
    return this.http.get(`${this.Alldivisions}?regionId=${regionId}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }

  public getAllEmployeeDetails(): Observable<EmployeeData> {
    return this.http.get(`${this.allEmployeeDetails}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }

  public getLastLoginDate(userId: string): Observable<LastLogin> {
    return this.http.get(`${this.LastLoginUrl}?userId=${userId}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }

  public getAllTimePeriod(): Observable<PeriodData> {
    return this.http.get(`${this.AllTimePeriods}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }

  public getResourcesByChargeCode(chargeCodeId: number | string): Observable<ResourcesByChargeCode> {
    return this.http.get(`${this.Resourcesbychargecode}?chargeCodeId=${chargeCodeId}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => {
        let data = resp.json();
          data.details.forEach((obj) => {
            obj['isDelete'] = obj.time_period_name === this.commonService.getCurrnetDateRange();
      });
        return data;
      });
  }

  public saveAssignChargeCodes(obj: AssignChargeCodes): Observable<any> {
    return this.http.post(`${this.AssignchargecodesUrl}`, obj, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }

  public saveChargeCodeTaskDetailsById(obj: any): Observable<ChargeCodeTask> {
    return this.http.post(`${this.Savechargecodetaskdetailsbyid}`, obj, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }

  public setChargeCodeActiveInactive ( chargeCode: number | string, status: string): Observable<ChargeCodeDetails> {
    return this.http.get(`${this.Setchargecodeactiveinactive}?chargeCodeId=${chargeCode}&status=${status}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }
  public getGenerateChargeCode ( sfc: string, yr: string | number, cct: string): Observable<GenerateChargeCode> {
    return this.http.get(`${this.GeneratechargecodeUrl}?sfc=${sfc}&yr=${yr}&cct=${cct}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }
  public getGenerateChargeTaskCode ( chargeCode: string): Observable<GenerateChargeCode> {
    return this.http.get(`${this.GeneratechargetaskcodeUrl}?chargeCode=${chargeCode}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }
  public getSponsorList (): Observable<SponsorList> {
    return this.http.get(`${this.GetsponsorlistUrl}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => {
        let data = resp.json();
            data.details.map((obj) => {
              obj['empName'] = `${obj.sponsorlist_empId} - ${obj.sponsorlist_empName}`;
              return obj;
            });
        return data;
      });
  }
  public getAssignedPopupView(taskCode: number | string, st: string, ed: string, empId: string ): Observable<TimePeriodsDetail> {
    return this.http.get(`${this.AssignedpopupviewUrl}?chargeCodeId=${taskCode}&st=${st}&ed=${ed}&empId=${empId}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => {
        let data = resp.json();
            data.details.forEach((obj) => {
              obj['isActive'] = obj.user_charge_code_map_status === 'Active' ? true : false;
              obj['isDelete'] = obj.time_period_name === this.commonService.getCurrnetDateRange();
            });
        return data;
      });
  }
  public setAssignmentStatusById( assignId: number | string, tpId: number | string, taskId: number | string, status: string ): Observable<GenericObj> {
    return this.http.get(`${this.Setassignmentstatusbyid}?assignId=${assignId}&tpId=${tpId}&taskId=${taskId}&status=${status}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => {
        let data = resp.json();
        return data;
      });
  }
  public deleteAssignmentStatusById( assignId: number | string, taskId: number | string ): Observable<GenericObj> {
    return this.http.get(`${this.Deleteassignmentstatusbyid}?assignId=${assignId}&taskId=${taskId}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => {
        let data = resp.json();
        return data;
      });
  }
  public updateOwnerInChargeCode( obj: OwnerParamObj): Observable<GenericObj> {
    return this.http.post(this.Updateownerinchargecode, obj, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }
  public getRoles(): Observable<Roles> {
    return this.http.get(this.RolesUrl, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }
  public saveSponsorDetails( obj: AddSponsor): Observable<GenericObj> {
    return this.http.post(this.Updatesponosrdetails, obj, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }
  public getSponsorListToGrid(): Observable<GenericObj> {
    return this.http.get(this.Getsponsorlisttogrid, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }
  public getAllRoleMaps(id?: any): Observable<AllUsersWithRoles> {
    return this.http.get(`${this.Getallrolemaps}?id=`, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }
  public updateUserTaskMap( obj: TaskCodeEditSave): Observable<GenericObj> {
    return this.http.post(this.Updateusertaskmap, obj, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }
  public getChargeCodeParentLists( subFunId: string | number): Observable<ChargeCodeParentList> {
    return this.http.get(`${this.ChargeCodeParentLists}?subFun=${subFunId}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }
  public getFaqDetails(): Observable<Faqs> {
    return this.http.get(this.FaqDetails, this.REQUEST_OPTIONS)
      .map((resp: Response) => {
        let data = resp.json();
        data.details.forEach((obj) => {
          obj['isCollapse'] = true;
        });
        return data;
      });
  }
  public getTreeList( spnr: string): Observable<TreeList> {
    return this.http.get(`${this.TtreelistUrl}?spnr=${spnr}`, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }
  public sendContactDetails( obj: any): Observable<GenericObj> {
    return this.http.post(this.ContactusUrl, obj, this.REQUEST_OPTIONS)
      .map((resp: Response) => resp.json());
  }
}

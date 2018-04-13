import { Observable } from 'rxjs/Observable';
import {
  ILogin,
  LoginResponse,
  ChargeCodeDetails,
  ChargeCodeDetailsData,
  AllChargeCodes,
  AllFunctionGroups,
  AllSubFunctionGroups,
  AllRegions,
  AllDivisions,
  EmployeeData,
  LastLogin,
  PeriodData,
  ResourcesByChargeCode,
  AssignChargeCodes,
  ChargeCodeTask,
  GenerateChargeCode,
  SponsorList,
  TimePeriodsDetail,
  GenericObj,
  OwnerParamObj,
  Roles,
  AddSponsor,
  SponsorGrid,
  AllUsersWithRoles,
  TaskCodeEditSave,
  ChargeCodeParentList,
  Faqs,
  TreeList,
  Contacts
} from '../app.interface';
export abstract class DataService {
    public abstract loginUser( obj: ILogin): Observable<LoginResponse>;
    public abstract getChargeCodesDetails ( roleName: string, empId: string, isSponsorOwner?: boolean): Observable<ChargeCodeDetails>;
    public abstract saveChargeCodeDetails (obj: ChargeCodeDetails): Observable<ChargeCodeDetails>;
    public abstract getAllChargeCodetypes (subFunCode: string): Observable<AllChargeCodes>;
    public abstract getAllFunctionGroups (): Observable<AllFunctionGroups>;
    public abstract getAllSubFunctionGroups ( functionGrpId: string | number): Observable<AllSubFunctionGroups>;
    public abstract getAllregions (): Observable<AllRegions>;
    public abstract getAlldivisions (regionId: string | number): Observable<AllDivisions>;
    public abstract getAllEmployeeDetails(): Observable<EmployeeData>;
    public abstract getLastLoginDate( userId: string): Observable<LastLogin>;
    public abstract getAllTimePeriod(): Observable<PeriodData>;
    public abstract getResourcesByChargeCode(chargeCodeId: number | string): Observable<ResourcesByChargeCode>;
    public abstract saveAssignChargeCodes(obj: AssignChargeCodes): Observable<any>;
    public abstract saveChargeCodeTaskDetailsById(obj: any): Observable<ChargeCodeTask>;
    public abstract setChargeCodeActiveInactive(chargeCode: number | string, status: string): Observable<ChargeCodeDetails>;
    public abstract getGenerateChargeCode(sfc: string, yr: string | number, cct: string): Observable<GenerateChargeCode>;
    public abstract getGenerateChargeTaskCode(chargeCode: string): Observable<GenerateChargeCode>;
    public abstract getSponsorList(): Observable<SponsorList>;
    public abstract getAssignedPopupView( taskCode: number | string, st: string, ed: string, empId: string ): Observable<GenericObj>;
    public abstract setAssignmentStatusById( assignId: number | string, tpId: number | string, taskId: number | string, status: string ): Observable<TimePeriodsDetail>;
    public abstract deleteAssignmentStatusById( assignId: number | string, taskId: number | string): Observable<GenericObj>;
    public abstract updateOwnerInChargeCode( obj: OwnerParamObj): Observable<GenericObj>;
    public abstract getRoles(): Observable<Roles>;
    public abstract saveSponsorDetails( obj: AddSponsor ): Observable<GenericObj>;
    public abstract getSponsorListToGrid(): Observable<SponsorGrid>;
    public abstract getAllRoleMaps(id?: any): Observable<AllUsersWithRoles>;
    public abstract updateUserTaskMap( obj: TaskCodeEditSave ): Observable<GenericObj>;
    public abstract getChargeCodeParentLists( subFunId: string | number ): Observable<ChargeCodeParentList>;
    public abstract getFaqDetails(): Observable<Faqs>;
    public abstract getTreeList( spnr: string ): Observable<TreeList>;
    public abstract sendContactDetails( obj: any): Observable<GenericObj>;

}

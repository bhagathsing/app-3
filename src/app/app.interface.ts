import {getWeekNumbers} from 'ngx-bootstrap/datepicker/engine/format-days-calendar';

export interface ILogin {
    userId: string;
    password: string;
}

export interface UserMenuList {
  menuId: number;
  menuName: string;
  url: string;
}
export interface LoginResponse {
    employeeId: string;
    employeeName: string;
    employeeRoleId: number;
    employeeRoleName: string;
    deliveryUnit: number;
    app_id: number;
    menuList: UserMenuList[];
}

export interface APIResponse {
    actionStatus: boolean;
    errorMessage: any;
}

export interface ChargeCodeDetailsData {
    charge_code_owner: string;
    charge_code_owner_emp?: string;
    charge_code_parent_id: number;
    charge_code_task_code: string;
    charge_code_task_desc: string;
    charge_code_task_id: string | number;
    charge_code_type_desc: string;
    charge_code_type_id: number;
    charge_code_task_status?: string;
    charge_code_task_validto?: Date;
    charge_code_task_validfrom?: Date;
    sponsor: string;
    valid_from: string;
    valid_to: string;
    charge_code_type?: string;
    charge_code_id: number;
    charge_code: string;
    charge_code_description: string;
    function_grp_id: number;
    function_grp_name: string;
    chargeable_hours: number;
    bu_id: number;
    sponsor_id: string;
    status: string;
    year: number;
    isActive: boolean;
    region_id?: number;
    region_name?: string;
    division_id?: number;
    division_name?: string;
    sub_function_grp_id?: number;
    sub_function_grp_name?: string;
    charge_code_parent?: string;
}
export interface ChargeCodeDetails extends APIResponse {
    details: ChargeCodeDetailsData[];
}

export interface AllChargeCodeTypesData {
  charge_code_types_id: number | string;
  charge_code_types_Fun_Code: string;
  charge_code_type: string;
  charge_code_type_char: string;
  charge_code_type_grpno: number | string;
}

export interface AllChargeCodes extends APIResponse {
    details: AllChargeCodeTypesData[];
}
export interface AllFunctionGroupData {
    function_grp_id: number | string;
    function_grp_name: string;
    shortCutName?: string;
}
export interface AllFunctionGroups extends APIResponse {
    details: AllFunctionGroupData[];
}
export interface AllSubFunctionGroupData {
    sub_function_grp_id: number | string;
    sub_function_grp_name: string;
    sub_function_group_code?: string;
}
export interface AllSubFunctionGroups extends APIResponse {
    details: AllSubFunctionGroupData[];
}

export interface AllRegionsData {
    region_id: number | string;
    region_name: string;
}

export interface AllRegions extends APIResponse {
    details: AllRegionsData[];
}

export interface AllDivisionsData {
    division_id: number | string;
    division_name: string;
    region_id: number;
}

export interface AllDivisions extends APIResponse {
    details: AllDivisionsData[];
}

export interface EmployeeDetails {
    userId: string;
    userEmail?: string;
    userName: string;
 }
export interface EmployeeData {
     details: EmployeeDetails[];
     actionStatus: boolean;
     errorMessage: any;
}

export interface LastLogin extends APIResponse {
    details: Date;
}
export interface PeriodData {
    currentPeriodDetailsBean: CurrentPeriod;
    timePeriodMasterBean: CurrentPeriod[];
}
export interface CurrentPeriod {
    timePeriodId: number;
    timePeriodName: string;
    timePeriodLastdate: number;
}
export interface ResourcesByChargeCodeData {
  emp_charg_code_map_id: number;
  user_charge_code_map_status: string;
  time_period_id: number;
  time_period_name: string;
  user_id: string;
  user_name: string;
  approver_emp_id: string;
  approver_name: string;
  charge_code_task_id: number;
  charge_code_task_code: string;
  charge_code_task_desc: string;
  user_charge_code_map_validFrom: number | Date;
  user_charge_code_map_validTo: number | Date;
  isDelete?: boolean;
}

export interface ResourcesByChargeCode extends APIResponse {
    details: ResourcesByChargeCodeData[];
}

export interface AssignChargeCodes {
    empIds: string[];
    chargeCodeTaskIds: number[];
    timePeriodValidFrom: number | Date | string;
    timePeriodValidTo: number | Date | string;
    charge_code_assign_by: string;
    user_charge_code_assign_date: string;
}
export interface ChargeCodeTaskData {
    charge_code_task_code: string;
    charge_code_task_desc: string;
    charge_code_parent_id: number;
    charge_code_task_owner: string;
    charge_code_task_validfrom: Date;
    charge_code_task_validto: Date;
    charge_code_task_status: string;
}

export interface ChargeCodeTask extends APIResponse {
    details: ChargeCodeTaskData[];
}
export interface GenerateChargeCode extends APIResponse {
  details: string;
}
export interface SponsorListData {
  sponsorlist_id?: string | number;
  sponsorlist_regionId?: number | string;
  sponsorlist_divisionId?: string | number;
  sponsorlist_subFunctionGroupId?: number | string;
  sponsorlist_empId?: string;
  sponsorlist_empName?: string;
  sponsorlist_functionGroupId?: number | string;

}
export interface SponsorList extends APIResponse {
  details: SponsorListData[];
}
export  interface TimePeriodsDetailData {
  emp_charg_code_map_id: number | string;
  user_charge_code_map_status: string;
  time_period_id: number;
  time_period_name: string;
  charge_code_id: number;
  user_id: string;
  user_charge_code_map_validFrom: number | Date;
  user_charge_code_map_validTo: number | Date;
  isActive?: boolean;
}
export interface TimePeriodsDetail extends APIResponse {
  details: TimePeriodsDetailData[];
}
export interface GenericObj extends APIResponse {
  details: any;
}
export interface OwnerParamObjData {
  ChargeCodeID: number;
  ChargeCodeOldOwners: string[];
  ChargeCodeNewOwners: string[];
  empId: string;
  role: string;
}
export interface OwnerParamObj extends  APIResponse {
  details: OwnerParamObjData[];
}
export interface RolesData {
  roleId: number;
  roleName: string;
}
export interface Roles extends APIResponse {
  details: RolesData[];
}

export interface AddSponsorData extends SponsorListData {
  user_id?: string;
  role_id?: string;
  app_id?: string;

}
export interface AddSponsor extends APIResponse {
  details: AddSponsorData[];
}

export interface SponsorGridData extends SponsorListData {
  user_id: string;
  user_name: string;
  role_id: number;
  role_name: string;
  app_id: number;
  desgn_id: number;
  desg_name: string;
  bu_id: number;
  bu_name: string;
  du_id: number;
  division_name: string;
  manager: string;
  project: string;
  project_name: string;

}
export interface SponsorGrid extends APIResponse {
  details: SponsorGridData[];
}
export interface AllUsersWithRolesData {
  user_role_map_id: number | string;
  role_id: number;
  user_id: string;
  app_id: number | string;
  user_name: string;
  role_name: string;
  role_description: string;
}
export interface AllUsersWithRoles extends APIResponse {
  details: AllUsersWithRolesData[];
}

export interface TaskCodeEditSaveData {
  emp_id: string;
  charge_code_id: number | string;
  user_charge_code_map_validFrom: Date;
  user_charge_code_map_validTo: Date;
  charge_code_assign_by: string;
  user_charge_code_assign_date: Date;
}

export interface TaskCodeEditSave extends APIResponse {
  details: TaskCodeEditSaveData[];
}
export interface ChargeCodeParentList extends APIResponse {
  details: string[];
}
export interface FaqSubDetails {
  question: string;
  answer: string;
}
export interface FaqsData {
  categoryName: string;
  faqSubDetails: FaqSubDetails[];
  isCollapse?: boolean;
}
export interface Faqs extends APIResponse {
  details: FaqsData[];
}
export interface TreeListData {
  id: string;
  parent: string;
  text: string;
}
export interface TreeList extends APIResponse {
  details: TreeListData[];
}
export interface ContactsData {
  uname: string;
  uemailid: string;
  message: string;
  attachment: any;
}
export interface Contacts extends APIResponse {
  details: ContactsData[];
}





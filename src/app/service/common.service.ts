import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {AbstractControl, FormGroup} from '@angular/forms';
@Injectable()
export class CommonService {
   // private subject = new Subject<any>();
    public menuItems = new EventEmitter();
    public editAssignMent = new EventEmitter();
    public reloadChargeCodes = new EventEmitter();
    public configurSaving = new EventEmitter();
    public getAllConfigEmp = new EventEmitter();
    public addChargeCodeSuccess = new EventEmitter();
    public addUserEmit = new EventEmitter();

    public dotKeyValues = [110, 190];
    public onlyNumbers = [15, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 6, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 38, 40, 8, 9, 37, 39, 46];
    public CapitalStringOnly = [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122];
    public onlyStringKeys = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
    public actionKeys = [8, 45, 13, 18, 16, 20, 17, 32];
    public shortCutFunctionGruop = ['DEL', 'MKT', 'SLS', 'PRC', 'FIN', 'ICT', 'CSS', 'HRM', 'TAG', 'TDG'];

    public WeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    public monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    public Month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    constructor() {

    }
    public getKeys(key1: number[], key2: number[]) {
        return key1.concat(key2);
    }
    public findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            var val = (array[i][attr]).trim();
            if (val === value) {
                return true;
            }
        }
        return false;
    }
    public filterMultiSelectData(data, filterModel, key) {
        if (filterModel.substring(0, 2).toLocaleLowerCase() === 'e0') {
            return data.filter(function (obj) {
                return obj['userId'].toLocaleLowerCase().indexOf(filterModel.toLocaleLowerCase()) > -1;
            });
        } else {
            return data.filter(function (obj) {
                return obj[key].toLocaleLowerCase().indexOf(filterModel.toLocaleLowerCase()) > -1;
            });
        }

    }
    public setConfirmOptions(
        title: string,
        message: string,
        confirmText: string,
        cancelText: string,
        type: string,
        isCheck?: string,
        disclaimerText?: string) {

        var obj = {
          title: title,
          message: message,
          confirmText: confirmText,
          cancelText: cancelText,
          type: type,
          isCheckBox: isCheck ? isCheck : 'No',
          disclaimerText: disclaimerText ? disclaimerText : ''
        };
        return obj;
    }
    public findSelectedChargeCode( obj, select ) {
        let arr =  obj.filter((objs) => {
          if (select === 'selected') {
             return objs.assignmentId !== '';
          }else {
           return objs.isSelectValid === true;
          }
         });
         return arr;
     }

     public findDuplicates( arrs ) {
        var sorted, i, isDuplicate;
        var names = 'assignmentId';
        sorted = arrs.concat().sort(function (a, b) {
            if (a[names] > b[names]) {return 1; }
            if (a[names] < b[names]) {return -1; }
            return 0;
        });
        for (i = 0; i < arrs.length; i++) {
            isDuplicate = (
                (sorted[i - 1] && sorted[i - 1][names] !== '' && sorted[i - 1][names] == sorted[i][names]) ||
                (sorted[i + 1] && sorted[i + 1][names] !== '' && sorted[i + 1][names] == sorted[i][names])
            );
            sorted[i].isSelectValid = isDuplicate;
        }
     }
     public findPeriodStartDate(val) {
        let strtPeriodArry = val;
        let period;
        if (val[0] >= 1 && val[0] <= 15) {
            strtPeriodArry[0] = 1;
            period = strtPeriodArry.join(' ');
        } else {
            strtPeriodArry[0] = 16;
            period = strtPeriodArry.join(' ');
        }
        return period;
    }
    public disabledReactiveFormFields(form: FormGroup, fields: string[] ) {
      fields.forEach(( ele ) => {
        form.controls[ele].disable();
      });
    }
    public findLocationOurs( obj, rowData ) {
        let country = obj.find((ele) => {
            return ele.loc_id === rowData.countryId;
        });
        return country;
    }
    public ObjectToJsonToObject( obj: object ) {
      return JSON.parse(JSON.stringify(obj));
    }
    public dateFromatValidation() {
      return function (c: AbstractControl): {[key: string]: any}{
        let val = c.value;
        if (!val) {
          return null;
        }
        let value = val.split(' - ');
        if (value.length < 2 ) {
          return {
            'dateFormat': true
          };
        }
        return null;
      };
    }
    public getCurrnetDateRange() {
      let d = new Date(); // 1 Feb 2018 - 15 Feb 2018
      let st = `${d.getDate() <= 15 ? 1 : 16} ${this.monthNames[d.getMonth()]} ${d.getFullYear()}`;
      let ed = `${d.getDate() <= 15 ? 15 : this.Month[d.getMonth()]} ${this.monthNames[d.getMonth()]} ${d.getFullYear()}`;
      let dateFormat = st + ' - ' + ed;
      return dateFormat;
    }
    public duplicateChargeCodeDescription( arr: string[], existVal) {
      return function (c: AbstractControl): {[key: string]: any}{
        let val = c.value;
        if (!val) {
          return null;
        }
        let currentVal = val.toLowerCase();
        if ((arr.indexOf(currentVal) > -1  && existVal.toLowerCase() !== currentVal)) {
          return {
            'duplicateDesc': true
          };
        }
        return null;
      };
    }

    public adminRoleCheck( arr: any[], keyName: string) {
      return function (c: AbstractControl): {[key: string]: any}{
        let val = c.value.length;
        if (!val) {
          return null;
        }
        let isVal = c.value.find( o => arr.indexOf(o[keyName]) !== -1 );
        if (isVal) {
          return {
            'adminRole': true
          };
        }
        return null;
      };
    }

    public generateTree( list: any[]) {
        let map = {}, node, roots = [], i;
        for (i = 0; i < list.length; i += 1) {
          map[list[i].id] = i; // initialize the map
          list[i].children = []; // initialize the children
        }
        for (i = 0; i < list.length; i += 1) {
          node = list[i];
          if (node.parent !== node.id) {
            // if you have dangling branches check that map[node.parentId] exists
            list[map[node.parent]].children.push(node);
          } else {
            roots.push(node);
          }
        }
        return roots;
    }

}

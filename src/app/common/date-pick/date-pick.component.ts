import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CurrentPeriod } from '../../app.interface';
import { findIndex, find } from 'lodash';

interface DateObj {
  year: number;
  fStartDate: number;
  fEndDate: number;
  lStartDate: number;
  lEndDate: number;
  month: number;
  monthName: string;
};

@Component({
  selector: 'app-date-pick',
  templateUrl: './date-pick.component.html',
  styleUrls: ['./date-pick.component.scss']
})
export class DatePickComponent implements OnInit, OnChanges {
  @Input() dateObj: CurrentPeriod[];
  @Input() currentDateObj: CurrentPeriod;
  @Input() selectedDate: string;
  @Output() onChangeDate: EventEmitter<Object> = new EventEmitter();
  @Input() isOpen: boolean = false;
  @Input() dateRange: string;
  @Input() modalValue: string;
  public calendarData: any[];
  public dateObj1: any = {
    data: []
  };
  public dateObj2: any = {
    data: []
  };
  public selectedDatesany: any = []
  private dateModel: string;
  public dateObjs = {
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    monthDays: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  };

  private startInd: number = 0;
  private endInd: number = 2;

  private isStDate: boolean;
  constructor() { }

  ngOnInit() {
    if (this.modalValue) {
      this.selectedDatesany = this.modalValue.split(' - ');
    }
    this.setDatePick();
  }
  private setDatePick() {
    let stInd = this.getCurrentDateRange(this.currentDateObj);
    this.startInd = stInd;
    this.endInd = this.startInd + 2;
    this.currentDateRange(this.calendarData);
  }
  private getCurrentDateRange( d: any) {
    let cYearObj = new Date(d);
    this.updateMonth(cYearObj.getFullYear());
    this.calendarData =  this.createDatePickObj();
    return this.calendarData.findIndex((obj, ind) => {
      let y = cYearObj.getFullYear();
      let m = cYearObj.getMonth();
      return (obj.month === m && obj.year === y);
    });
  }
  public ngOnChanges( change: SimpleChanges) {
    //console.log(change);
    if (change.dateObj && change.dateObj.currentValue) {
      this.dateObj = change.dateObj.currentValue;
    }
    if(change.isOpen && change.isOpen.currentValue) {
      this.isOpen = change.isOpen.currentValue;
      this.isStDate = false;
      this.setDatePick();
    }
  }

  private createDatePickObj() {
    let dateArr = [];
    let fDate = new Date(this.dateObj[0].timePeriodLastdate);
    let lDate = new Date(this.dateObj[this.dateObj.length - 1].timePeriodLastdate);
    let lYear = lDate.getFullYear();
    let stYear = fDate.getFullYear();
    let stMonth = fDate.getMonth();

    let allDates = this.dateObj.length / 2;
    for (var i = 0; i < allDates; i++ ) {
      let d = new Date(`${stMonth + 1}/1/${stYear}`);
       let isStDesabled = false;
       let isStDesabled2 = false;
       let isEdDesabled = false;
       let isEdDesabled2 = false;
       if (this.dateRange) {
         let stDate = new Date(this.dateRange.split(' - ')[0]);
         let edDate = new Date(this.dateRange.split(' - ')[1]);

         let fstDate = new Date(`${d.getMonth() + 1 }/1/${d.getFullYear()}`);
         let fEdDate = new Date(`${d.getMonth() + 1 }/15/${d.getFullYear()}`);

         isStDesabled =  (fstDate < stDate) || (fEdDate < stDate) || (fEdDate > edDate);
         let lstDate = new Date(`${d.getMonth() + 1 }/16/${d.getFullYear()}`);
         let lEdtDate = new Date(`${d.getMonth() + 1 }/${this.dateObjs.monthDays[stMonth]}/${d.getFullYear()}`);
         isEdDesabled = ( isStDesabled && lstDate < edDate ) || ( isStDesabled && lEdtDate > edDate ) ;

         isStDesabled2 =  isStDesabled || (lstDate > edDate);
         isEdDesabled2 =  isEdDesabled || (lstDate > edDate);

         // isStDesabled2 =  (lstDate > stDate);
         // isEdDesabled2 =  (lstDate > edDate);

       }
       dateArr.push({
        year: d.getFullYear(),
        fStartDate: 1,
        fStartDateDisabled: isStDesabled,
        fStartDateDisabled2: isStDesabled2,
        lEndDateDisabled: isEdDesabled,
        lEndDateDisabled2: isEdDesabled2,
        fEndDate: 15,
        lStartDate: 16,
        lEndDate: this.dateObjs.monthDays[stMonth],
        month: d.getMonth(),
        monthName: this.dateObjs.month[stMonth],
      });
      if (stMonth < 11) {
        stMonth++;
      }else {
        stMonth = 0;
        if (stYear < lYear) {
          stYear++;
          this.updateMonth(stYear);
        }
      }
    }
    return dateArr;
  }

  private updateMonth( cYear: number ) {
    if ((cYear % 4 == 0) && (cYear % 100 != 0) || cYear % 400 == 0) {
      this.dateObjs.monthDays[1] = 29;
    }
  }
  private currentDateRange( arr: any[] ) {
    this.dateObj1.data = [];
    this.dateObj1.data = arr.slice(this.startInd, this.endInd);
  }
  public preveMonth() {
    this.startInd -= 1;
    this.endInd -= 1;
    if (this.startInd < 0) {
      this.endInd = 2;
      this.startInd = 0;
    }else {
      this.currentDateRange(this.calendarData);
    }
  }
  public nextMonth() {
      this.startInd += 1;
      this.endInd += 1;
    if (this.endInd > this.calendarData.length) {
      this.endInd = this.calendarData.length;
      this.startInd = this.endInd - 2;
      //this.endInd = this.calendarData.length;
    }else {
      this.currentDateRange(this.calendarData);
    }

   // console.log(this.startInd, this.endInd);
  }

  public onStartDate( date: DateObj, f: string ){
    this.isStDate = true;
    let d = f == 'f' ? date.fStartDate: date.lStartDate;
    this.selectedDatesany[0] = `${date.month+1}/${d}/${date.year}`;
    let lDate = this.selectedDatesany[1];
    if (lDate) {
      if (new Date(this.selectedDatesany[0]) > new Date(this.selectedDatesany[1])) {
        this.selectedDatesany[1] = ''
        this.isStDate = false;
      }else {
        this.isStDate = true;
      }
    }
    this.dateModel = this.selectedDatesany.toString().split(',').join('');
    let obj = {
      dateModel: this.dateModel,
      dateFullFill: false
    };
    this.onChangeDate.emit(obj);
  }
  public onEndDate( date: DateObj, f: string) {
    let d = f == 'f' ? date.fEndDate : date.lEndDate;
    let dateMatch = new Date(this.selectedDatesany[0]) < new Date(`${date.month + 1}/${d}/${date.year}`);

    this.selectedDatesany[1] = ` - ${date.month + 1}/${d}/${date.year}`;
    if (!dateMatch) {
      this.selectedDatesany[1] = '';
    }
    if (this.selectedDatesany[0] && this.selectedDatesany[1]) {
      this.isStDate = true;
    }
    this.dateModel = this.selectedDatesany.toString().split(',').join('');
    let obj = {
      dateModel: this.dateModel,
      dateFullFill: this.isStDate
    };
    this.onChangeDate.emit(obj);
  }

}

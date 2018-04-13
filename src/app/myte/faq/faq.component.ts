import { Component, OnInit } from '@angular/core';
import {DataService} from '../../service/DataService';
import {FaqsData} from '../../app.interface';
import {Subscription} from 'rxjs/Subscription';
import { collapseAnimation } from '../../service/animation.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  animations: [
    collapseAnimation
  ]
})
export class FaqComponent implements OnInit {
  public faqData: FaqsData[];
  public busy: Subscription;
  public isSelectedRow: any;
  constructor(private  dataService: DataService) { }

  public ngOnInit() {
    this.getFaqDetails();
  }
  public getFaqDetails() {
    this.busy =  this.dataService.getFaqDetails().subscribe((data) => {
      if (data.actionStatus) {
        this.faqData = data.details;
      }
    });
  }
  public selectQuestion( obj ) {
    this.isSelectedRow = obj;
  }
  public expandCollapse( obj: FaqsData) {
    obj.isCollapse = !obj.isCollapse;
  }

}

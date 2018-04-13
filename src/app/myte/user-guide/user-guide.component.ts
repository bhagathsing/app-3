import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  public pdfSrc: string = './assets/data/CCM_User_Guide_And_FAQs.pdf';
  constructor() { }

  ngOnInit() {
  }

}

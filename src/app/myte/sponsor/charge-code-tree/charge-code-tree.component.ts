import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { ITreeState, ITreeOptions, TreeModel, TreeComponent } from '../../../common/angular-tree/angular-tree-component';
import uuid from 'uuid';
import {DataService} from '../../../service/DataService';
import {CommonService} from '../../../service/common.service';
import {LoginResponse} from '../../../app.interface';
import {Ng2Storage} from '../../../service/storage';

@Component({
  selector: 'app-charge-code-tree',
  templateUrl: './charge-code-tree.component.html',
  styleUrls: ['./charge-code-tree.component.css']
})
export class ChargeCodeTreeComponent implements OnInit, AfterViewInit {
  @ViewChild('tree') tree: TreeComponent;
  public isExpand: boolean = false;
  public userData: LoginResponse;
  public state: ITreeState = {
    expandedNodeIds: {
      1: true,
      2: true
    },
    hiddenNodeIds: {},
    activeNodeIds: {}
  };

  public nodes = [];

  public options: ITreeOptions = {
    allowDrag: (node) => node.isLeaf,
    getNodeClone: (node) => ({
      ...node.data,
      id: uuid.v4(),
      name: `copy of ${node.data.name}`
    })
  };

  constructor( private dataService: DataService, private commonService: CommonService, private storage: Ng2Storage) { }

  public ngOnInit() {
    this.userData =  this.storage.getSession('user_data');
    this.getTreeListData();
  }
  public ngAfterViewInit() {

  }
  public expandCollapse() {
    this.isExpand = !this.isExpand;
    if (this.isExpand) {
      this.tree.treeModel.expandAll();
    }else {
      this.tree.treeModel.collapseAll();
    }
  }

  private getTreeListData() {
    this.dataService.getTreeList(this.userData.employeeId).subscribe((data) => {
      this.nodes = this.commonService.generateTree(data.details);
    });
  }

}

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DataService } from '../service/DataService';
import { Ng2Storage } from '../service/storage';
import { ILogin, LoginResponse } from '../app.interface';
import { Subscription} from 'rxjs/Subscription';
import { ConfirmComponent } from '../common/confirm/confirm.component';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild(ConfirmComponent) public confirmModal: ConfirmComponent;
  @ViewChild('videos') public videos: ElementRef;
  public loginForm: FormGroup;
  public confirmPopupData: any;
  public year: number = new Date().getFullYear();
  private loginFormModel: ILogin = {
    userId: undefined,
    password: undefined
  };
  public metaData: LoginResponse;
  public formErrors: ILogin = {
    userId: '',
    password: ''
  }
  public isLogin: boolean = false;
  public busy: Subscription;

  public isPlay = false;
  public _onPlayVideo = this.onPlayVideo.bind(this);
  public _onPausVideo = this.onPausVideo.bind(this);
  public _onFullScreen = this.onFullScreen.bind(this);
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService,
    private storage: Ng2Storage,
    private commonService: CommonService
    ) {
  }

  public ngOnInit() {
    this.confirmPopupData =  this.commonService.setConfirmOptions('Error','You are not autherised. Please contact RMG Team','Ok','--','danger');
    this.metaData = this.storage.getSession('user_data');
    if(this.metaData && this.metaData.employeeRoleName.toLowerCase() === 'chargecodeadmin' ){
     this.router.navigate(['/app/admin']);
    }else if(this.metaData && this.metaData.employeeRoleName.toLowerCase() === 'chargecodeowner' ){
      this.router.navigate(['/app/owner']);
    }else if(this.metaData && this.metaData.employeeRoleName.toLowerCase() === 'chargecodesponsor' ){
      this.router.navigate(['/app/sponsor']);
    }else{
      this.router.navigate(['/login']);
    }
    this.formBuilder();
  }

  public ngAfterViewInit() {
    this.videos.nativeElement.addEventListener('play', this._onPlayVideo);
    this.videos.nativeElement.addEventListener('pause', this._onPausVideo);
    this.videos.nativeElement.addEventListener('webkitfullscreenchange', this._onFullScreen);
    this.videos.nativeElement.addEventListener('mozfullscreenchange', this._onFullScreen);
    this.videos.nativeElement.addEventListener('fullscreenchange', this._onFullScreen);
    this.videos.nativeElement.addEventListener('MSFullscreenChange', this._onFullScreen);
  }
  private formBuilder(){
    this.loginForm = this.fb.group({
      userId:[
          this.loginFormModel.userId,
          [
              Validators.required
          ]
      ],
      password:[
          this.loginFormModel.password,
          [
              Validators.required
          ]
      ]
    });
    this.loginForm.valueChanges.subscribe(data => this.onValuesChanged(data));
    this.onValuesChanged();
  }


  public getUserDetails( objs ) {
    this.metaData = this.storage.getSession('user_data');
   // this.busy = this.dataService.getUser(userId.userId).subscribe((data: User) => {
     // this.commonService.menuItems.emit(data.details.menuBeanList);
     // this.userData = data;
      //this.router.navigate(['/app']);
      //  if(objs.employeeRoleName.toLocaleLowerCase() == 'reviewer'){
      //   this.router.navigate(['/app']);
      // }else{
      //   this.router.navigate(['/app']);
      // }
   // })

    if(this.metaData && this.metaData.employeeRoleName.toLowerCase() === 'chargecodeadmin' ){
      this.router.navigate(['/app/admin']);
    }else if(this.metaData && this.metaData.employeeRoleName.toLowerCase() === 'chargecodeowner' ){
      this.router.navigate(['/app/owner']);
    }else if(this.metaData && this.metaData.employeeRoleName.toLowerCase() === 'chargecodesponsor' ){
      this.router.navigate(['/app/sponsor']);
    }
  }

  public onLogin(){

    if(this.loginForm.valid) {
      this.loginFormModel = this.loginForm.value;
      this.busy = this.dataService.loginUser(this.loginFormModel).subscribe((data)=>{
        this.isLogin = false;
        if(data.employeeId){
          this.getUserDetails(data);
        }else{
          this.confirmModal.show(null)
          .then((): void => {
          }).catch(()=>{
          })
        }
      },(err)=>{
      //  console.log('ERROR',err);
      //    this.confirmPopupData =  this.commonService.setConfirmOptions('Error','Something Error while login','Ok','--','danger');
      //    this.confirmModal.show('yes')
      //    .then((): void => {
      //    }).catch(()=>{
      //    })
       this.isLogin = true;
      })
    }else{
      this.storage.removeSession('user_data');
      this.storage.clearAllSession();
    }
  }
  public validationMessages = {
    'userId': {
      'required':  'Name is required.'
    },
    'password':{
      'required':  'Password is required.'
    }
  }

  public onValuesChanged(data?: any) {
      this.isLogin = false;
      if (!this.loginForm) { return; }
      const form = this.loginForm;
      for (const field in this.formErrors) {
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.invalid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
  }

  public playVideo() {
    let video = this.videos.nativeElement;
    if (video.paused) {
      this.videos.nativeElement.play();
    }else {
      this.videos.nativeElement.pause();
    }
  }
  public onPlayVideo(evt) {
    this.isPlay = true;
  }
  public onPausVideo() {
    this.isPlay = false;
  }
  public onFullScreen() {
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  form: FormGroup;
  passwordForm: FormGroup;
  public updateInvalid: boolean;
  private formSubmitAttempt: boolean;
  private returnUrl: string;
  currentUser: any;
  userSubs: Subscription = new Subscription();
  userInfo: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService, private _snackBar: MatSnackBar
  ) {
    this.currentUser = this.authService.currentUser;
  }

  async ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/profile';

    this.userSubs = await this.authService.getUserInfo(this.currentUser.uid).subscribe(data => {
      this.userInfo = { uid: data.payload.id, ...data.payload.data() };
      console.log("userinfo:>>>>>>>", this.userInfo);
      this.form = this.fb.group({
        uid: [this.userInfo.uid],
        fullname: [this.userInfo.displayName, Validators.required],
        phone: [this.userInfo.phone, Validators.required],
        address: [this.userInfo.address]
      });

      this.passwordForm = this.fb.group({
        uid: [this.userInfo.uid],
        password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        password_confirm: ['', Validators.compose([Validators.required, Validators.minLength(6), confirmPasswordValidator])]
      });
    });

    if (await this.authService.isLoggedIn) {
      await this.router.navigate([this.returnUrl]);
    }
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
  }

  async onSubmit() {
    this.updateInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        const uid = this.form.get('uid').value;
        const fullname = this.form.get('fullname').value;
        const phone = this.form.get('phone').value;
        const address = this.form.get('address').value;
        await this.authService.updateProfile(uid, fullname, phone, address);
        this._snackBar.open('updated successfuly!', 'Dance', {
          duration: 2000,
        });
      } catch (err) {
        this.updateInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }
  async onSubmitPasswordForm() {
    this.updateInvalid = false;
    this.formSubmitAttempt = false;
    if (this.passwordForm.valid) {
      try {
        const uid = this.passwordForm.get('uid').value;
        const password = this.passwordForm.get('password').value;
        await this.authService.changePassword(uid, password);
        this._snackBar.open('updated successfuly!', 'Dance', {
          duration: 2000,
        });
      } catch (err) {
        this.updateInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }

}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) { return null; }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('password_confirm');

  if (!password || !passwordConfirm) { return null; }

  if (passwordConfirm.value === '') { return null; }

  if (password.value === passwordConfirm.value) { return null; }

  return { passwordsNotMatching: true };
};

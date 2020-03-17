import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  public registerInvalid: boolean;
  private formSubmitAttempt: boolean;
  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
  }

  async ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

    this.form = this.fb.group({
      username: ['', Validators.email],
      fullname: ['', Validators.required],
      password: ['', Validators.required]
    });

    if (await this.authService.isLoggedIn) {
      await this.router.navigate([this.returnUrl]);
    }
  }

  async onSubmit() {
    this.registerInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        const username = this.form.get('username').value;
        const fullname = this.form.get('fullname').value;
        const password = this.form.get('password').value;
        await this.authService.register(username, password, fullname);
      } catch (err) {
        this.registerInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }

}

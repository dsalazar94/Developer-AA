import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { first } from 'rxjs/operators';

import {AuthService} from 'app/services/auth.service';
import {AlertService} from 'app/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  reactiveForm: FormGroup = new FormGroup({
    checked: new FormControl(true),
    unchecked: new FormControl(false)
  });

  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public remember: boolean = false;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthService,
      private alertService: AlertService
  ) {
      if (this.authenticationService.currentUserValue) {
          this.router.navigate(['layout/home']);
      }
  }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });

      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
      this.submitted = true;
      this.alertService.clear();
      if (this.loginForm.invalid) {
          return;
      }
      this.loading = true;
      this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
          .subscribe(
              data => {
                this.router.navigate(['layout/home']);
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
  }

}

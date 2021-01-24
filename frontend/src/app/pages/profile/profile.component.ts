import { Component, OnInit, Input, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { first } from 'rxjs/operators';

import { Profile } from 'app/interfaces/profile';

import { AuthService } from 'app/services/auth.service';
import { AlertService } from 'app/services/alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public reactiveForm: FormGroup = new FormGroup({
    checked: new FormControl(true),
    unchecked: new FormControl(false)
  });

  displayedColumns: string[] = ['name', 'email', 'rol'];

  public currentUser: Profile;

  public users = [];
  @Input() updateUser: Profile;
  data = {
    id: 0,
    name: "",
    lastname: "",
    rol: 0,
    email: "",
    token: ""
  };

  public UpdateUserForm: FormGroup;
  public submitted = false;
  public loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  async ngOnInit(){
    this.currentUser = this.data;
    this.UpdateUserForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required]
    });

    this.getUpdates();

  }

  get f() { return this.UpdateUserForm.controls; }

  async getUpdates(){
    this.users = await this.getUsers();
    this.currentUser = this.authenticationService.currentUserValue;
    this.updateUser = this.data;
  }

  private getUsers(): Promise<Profile[]>{
    return new Promise ((resolve, reject) => {
      this.authenticationService.getAllUsers()
          .pipe(first())
          .subscribe(
            users => {
              resolve(users);
            }
        );
    });
  }

  public updateProfile(){
    this.submitted = true;
    this.alertService.clear();
    /*if (this.UpdateUserForm.invalid) {
      return;
    }*/
    this.loading = true;

    this.updateUser.id = this.currentUser.id;
    if(this.f.name.value != ''){
      this.updateUser.name = this.f.name.value;
    }
    else{
      this.updateUser.name = this.currentUser.name;
    }
    if(this.f.lastname.value != ''){
      this.updateUser.lastname = this.f.lastname.value;
    }
    else{
      this.updateUser.lastname = this.currentUser.lastname;
    }
    this.updateUser.rol = this.currentUser.rol;
    if(this.f.email.value != ''){
      this.updateUser.email = this.f.email.value;
    }
    else{
      this.updateUser.email = this.currentUser.email;
    }


    this.authenticationService.updateUser(this.updateUser).pipe(first())
      .subscribe(
        data => {
          if(data){
            this.currentUser = data;
            this.getUpdates();
            this.alertService.success;
            this.authenticationService.logout();
            this.router.navigate(['/login']);

          }
          else{
            this.alertService.error;
          }
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

    }

    public updatePermissions(profile: Profile){
      const dialogRef = this.dialog.open(dialog_updatePermissions, {
        width: '500px',
        data: {profile: profile}
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result[0].profile);
        if(result[0].action == 1){
          this.authenticationService.updateUser(result[0].profile)
          .pipe(first()).subscribe(data => {
            this.getUpdates();
          });
        }
        else{
          return;
        }
      });
    }

}

@Component({
  selector: 'dialog_updatePermissions',
  templateUrl: './dialog_updatePermissions.html',
  styleUrls: ['./profile.component.css']
})

export class dialog_updatePermissions {


  @Input() updateUser: Profile;
  dataUser = {
    id: 0,
    name: "",
    lastname: "",
    rol: 0,
    email: "",
    token: ""
  };

  @Input() selectedValue: string = '';

  constructor(
    public dialogRef: MatDialogRef<dialog_updatePermissions>,
    @Inject(MAT_DIALOG_DATA) public data: Profile) {
      this.updateUser = this.dataUser;
    }

  update(rol: number): void{
    this.updateUser.id = this.data['profile'].id;
    this.updateUser.name = this.data['profile'].name;
    this.updateUser.lastname = this.data['profile'].lastname;
    this.updateUser.rol = +rol;
    this.updateUser.email = this.data['profile'].email;
    const retorno: Array<{action: number, profile: Profile}> = [{
      action: 1,
      profile: this.updateUser
    }];

    this.dialogRef.close(retorno);
  }
  cancel(): void {
    const retorno: Array<{action: number, profile: Profile}> = [{
      action: 2,
      profile: null
    }];

    this.dialogRef.close(retorno);
  }
}

import { Component, HostBinding } from '@angular/core';
import { Profile } from 'app/interfaces/profile';
import { AuthService } from 'app/services/auth.service';

@Component({
    moduleId: module.id,
    selector: 'footer-cmp',
    templateUrl: 'footer.component.html'
})

export class FooterComponent{
  public date : Date = new Date();
  public currentUser: Profile;

  constructor(
    private authenticationService: AuthService,
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { EnvService } from './env.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Profile } from 'app/interfaces/profile';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  headers: any;
  private currentUserSubject: BehaviorSubject<Profile>;
  public currentUser: Observable<Profile>;

  constructor(
    private http: HttpClient,
    private env: EnvService,
  ){
    this.currentUserSubject = new BehaviorSubject<Profile>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.headers = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      })
    };
  }

   //****   INI LOGIN USER   ***//
   login(email: String, password: String){

    const path = this.env.API_URL + 'api/user/login';

    return this.http.post<any>(path,
      {Email: email, Password: password}, {headers: this.headers}
    ).pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));

  }
  //****   FIN LOGIN USER   ***//

  //****   INI REGISTER USER   ***//
  public register(formValue){

    const path = this.env.API_URL + 'api/user/register';

    let pin: string = formValue.pin;
    let name: string = formValue.firstName;
    let lastname: string = formValue.lastName;
    let email: string = formValue.username;
    let password: String =  formValue.password;
    let confirm_pass: String = formValue.confirm_pass;

    return this.http.post<any>(path,
        { Pin: pin,
          Name: name,
          Lastname: lastname,
          Email: email,
          Password:password,
          Password_confirmation:confirm_pass
        },
        { headers: this.headers}
    ).pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));


  }
  //****   FIN REGISTER USER   ***//

  //****   INI LOGOUT USER   ***//
  public logout() {

    const path = this.env.API_URL + 'api/user/logout';

    let retorno = this.http.get(path, { headers: this.headers });

    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    return retorno;
  }
  //****   FIN LOGOUT USER   ***//

  public get currentUserValue(): Profile {
    return this.currentUserSubject.value;
  }

  public getAllUsers(){
    const path = this.env.API_URL + "api/user/getAllUser";
    return this.http.get<Profile[]>(path,{headers: this.headers });
  }

  public updateUser(updateUser: Profile){
    const path = this.env.API_URL + "api/user/update";
    return this.http.put<Profile>(path, updateUser, {headers: this.headers });
  }


}

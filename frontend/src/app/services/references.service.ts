import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { EnvService } from './env.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Reference } from 'app/interfaces/reference';
import { ReferenceHeader } from 'app/interfaces/reference-header';
import { Profile } from 'app/interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ReferencesService {

  headers: any;
  private currentUserSubject: BehaviorSubject<Profile>;
  public currentUser: Observable<Profile>;

  constructor(
    private http: HttpClient,
    private env: EnvService,
  ) {
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

  public GetAllHeaders(){
    const path = this.env.API_URL + "api/reference/getAllHeaders";
    return this.http.get<ReferenceHeader[]>(path,{headers: this.headers });
  }

  public GetAllReference(Ref_no: number){
    const path = this.env.API_URL + "api/reference/getAllReferences/" + Ref_no;
    return this.http.get<Reference[]>(path, {headers: this.headers });
  }

  public updateReference(reference: Reference){
    const path = this.env.API_URL + "api/reference/updateReference";
    return this.http.put<Reference>(path, reference, {headers: this.headers });
  }

  public addNewReference(reference: Reference){
    const path = this.env.API_URL + "api/reference/addNewReference";
    return this.http.post<Reference>(path, reference, {headers: this.headers });
  }

}

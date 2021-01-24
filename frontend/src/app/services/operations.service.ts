import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from "@angular/common";

import { EnvService } from './env.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { OperationType } from 'app/interfaces/operation-type';
import { Operation } from 'app/interfaces/operation';
import { Profile } from 'app/interfaces/profile';


@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  private headers: any;
  private currentUserSubject: BehaviorSubject<Profile>;
  public currentUser: Observable<Profile>;
  private data: Operation[] = [];

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

  public GetAllOperationsType(){
    const path = this.env.API_URL + "api/operation/getOperationsType";
    return this.http.get<OperationType[]>(path,{headers: this.headers });
  }

  public updateOperationType(operation: OperationType){
    const path = this.env.API_URL + "api/operation/updateOperationType";
    return this.http.put<OperationType>(path, operation, {headers: this.headers });
  }

  public addNewOperationType(operation: OperationType){
    const path = this.env.API_URL + "api/operation/addNewOperationType";
    return this.http.post<any>(path, operation, {headers: this.headers });
  }

  public getAllOperations(fecha: Date){
    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
    const date = formatDate(fecha, format, locale);
    const path = this.env.API_URL + "api/operation/getOperations/" + date;
    return this.http.get<Operation[]>(path,{headers: this.headers });
  }

  public updateOperation(operation: Operation){
    const path = this.env.API_URL + "api/operation/updateOperation";
    return this.http.put<any>(path, operation, {headers: this.headers });
  }

  public addNewOperation(operation: Operation){
    const path = this.env.API_URL + "api/operation/addNewOperation";
    return this.http.post<any>(path, operation, {headers: this.headers });
  }



}

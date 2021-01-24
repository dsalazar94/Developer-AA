import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { EnvService } from './env.service';

import { BehaviorSubject, Observable } from 'rxjs';

import { Finca } from 'app/interfaces/finca';
import { Zona } from 'app/interfaces/zona';
import { Guacho } from 'app/interfaces/guacho';
import { Planta } from 'app/interfaces/planta';
import { Flor } from 'app/interfaces/flor';
import { Profile } from 'app/interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class FarmService {

  private headers: any;
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

  public GetAllFinca(){
    const path = this.env.API_URL + "api/farm/getFincas";
    return this.http.get<Finca[]>(path,{headers: this.headers });
  }

  public GetAllZona(finca: number){
    const path = this.env.API_URL + "api/farm/getZonas/" + finca;
    return this.http.get<Zona[]>(path,{headers: this.headers });
  }

  public GetAllGuacho(finca: number, zona: number){
    const path = this.env.API_URL + "api/farm/getGuachos/" + finca + "/" + zona;
    return this.http.get<Guacho[]>(path,{headers: this.headers });
  }

  public GetAllPlanta(finca: number, zona: number, guacho: number){
    const path = this.env.API_URL + "api/farm/getPlantas/" + finca + "/" + zona + "/" + guacho;
    return this.http.get<Planta[]>(path,{headers: this.headers });
  }

  public GetAllFlor(finca: number, zona: number, guacho: number, planta: number){
    const path = this.env.API_URL + "api/farm/getFlores/" + finca + "/" + zona + "/" + guacho + "/" + planta;
    return this.http.get<Flor[]>(path,{headers: this.headers });
  }

}

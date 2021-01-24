import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  //API_URL = 'http://localhost:4000/';

  API_URL = 'https://backend-acklenavenue.herokuapp.com/';


  constructor() { }
}

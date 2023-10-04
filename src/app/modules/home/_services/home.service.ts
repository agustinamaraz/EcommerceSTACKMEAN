import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    public http: HttpClient,
  ) { }
  listHome(TIME_NOW:any=''){
    let URL = URL_SERVICIOS+"home/list?TIME_NOW="+TIME_NOW;
    return this.http.get(URL);
  }
}

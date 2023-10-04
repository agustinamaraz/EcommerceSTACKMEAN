import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth-profile/_services/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class EcommerceAuthService {

  constructor(
    public http: HttpClient,
    public _authService: AuthService
  ) { }

    //direccion de cliente
  listAddressClient(id:any){
    let headers = new HttpHeaders({'token':this._authService.token});
    let URL = URL_SERVICIOS+"address_client/list?user_id="+id;
    return this.http.get(URL,{headers:headers})
  }

  registerAddressClient(data:any){
    let headers = new HttpHeaders(
      {
        'token': this._authService.token
      }
    )
    let URL = URL_SERVICIOS+"address_client/register";
    return this.http.post(URL,data,{headers:headers});
  }

  updateAddressClient(data:any){
    let headers = new HttpHeaders(
      {
        'token': this._authService.token
      }
    )
    let URL = URL_SERVICIOS+"address_client/update";
    return this.http.put(URL,data,{headers:headers});
  }

  deleteAddressClient(id:any){
    let headers = new HttpHeaders(
      {
        'token': this._authService.token
      }
    )
    let URL = URL_SERVICIOS+"address_client/delete/"+id;
    return this.http.delete(URL,{headers:headers});
  }
  //

  registerSale(data:any){
    let headers = new HttpHeaders(
      {
        'token': this._authService.token
      }
    )
    let URL = URL_SERVICIOS+"sale/register";
    return this.http.post(URL,data,{headers:headers});
  }
  //
  showProfileClient(id:any){
    let headers = new HttpHeaders(
      {
        'token': this._authService.token
      }
    )
    let URL = URL_SERVICIOS+"home/profile_client";
    return this.http.post(URL,id,{headers:headers});
  }
  UpdateProfileClient(id:any){
    let headers = new HttpHeaders(
      {
        'token': this._authService.token
      }
    )
    let URL = URL_SERVICIOS+"home/update_client";
    return this.http.put(URL,id,{headers:headers});
  }

  //review

  regsiterReview(id:any){
    let headers = new HttpHeaders(
      {
        'token': this._authService.token
      }
    )
    let URL = URL_SERVICIOS+"review/register";
    return this.http.post(URL,id,{headers:headers});
  }
  UpdateReview(id:any){
    let headers = new HttpHeaders(
      {
        'token': this._authService.token
      }
    )
    let URL = URL_SERVICIOS+"review/update";
    return this.http.put(URL,id,{headers:headers});
  }

}

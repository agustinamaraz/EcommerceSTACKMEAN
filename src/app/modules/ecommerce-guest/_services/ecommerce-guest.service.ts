import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth-profile/_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EcommerceGuestService {

  constructor(
    public http: HttpClient,
    public _authService: AuthService,
  ) { }


  showLandingProduct(slug: string, discount_id: any = null) {
    let LINK = "";

    if (discount_id) {
      LINK = "?_id=" + discount_id;
    }

    let URL = URL_SERVICIOS + "home/landing-product/" + slug + LINK;
    return this.http.get(URL);
  }

  configInitial() {
    let URL = URL_SERVICIOS + "home/config_initial";
    return this.http.get(URL);
  }

  filterProducts(data:any) {
    let TIME_NOW = new Date().getTime();
    let URL = URL_SERVICIOS + "home/filter_products?TIME_NOW=" + TIME_NOW;
    return this.http.post(URL, data);
  }
}

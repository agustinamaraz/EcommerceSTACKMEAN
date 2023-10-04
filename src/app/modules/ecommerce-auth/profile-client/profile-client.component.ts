import { Component, OnInit } from '@angular/core';
import { EcommerceAuthService } from '../_services/ecommerce-auth.service';
declare function alertDanger([]): any;
declare function alertSuccess([]): any;
@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css']
})
export class ProfileClientComponent implements OnInit {
  listAddressClient: any = [];
  sale_orders: any = [];
  is_detail_sale: any = false;
  order_selected: any = null;
  name: any = null;
  surname: any = null;
  pais: any = null;
  address: any = null;
  referencia: any = null;
  region: any = null;
  ciudad: any = null;
  telefono: any = null;
  email: any = null;
  notas: any = null;
  address_client_selected: any = null;
  cantidad: any = 0;
  description: any = null;
  sale_detail_selected: any = null;

  //variables que estaran bindeando el formulario para los datos del cliente
  name_c: any = null;
  surname_c: any = null;
  email_c: any = null;
  password: any = null;
  password_repeat: any = null;

  constructor(
    public authEcommerceService: EcommerceAuthService,
  ) { }

  ngOnInit(): void {
    this.showProfileClient();

    this.authEcommerceService.listAddressClient(this.authEcommerceService._authService.user._id).subscribe(
      (result: any) => {
        console.log(result)
        this.listAddressClient = result.address_client;
      }
    )

    this.name_c = this.authEcommerceService._authService.user.name;
    this.surname_c = this.authEcommerceService._authService.user.surname;
    this.email_c = this.authEcommerceService._authService.user.email;
  }

  showProfileClient() {
    let data = {
      user_id: this.authEcommerceService._authService.user._id,

    }

    this.authEcommerceService.showProfileClient(data).subscribe(
      (result: any) => {
        console.log(result)
        this.sale_orders = result.sale_orders;
      }
    )
  }

  getDate(date: any) {
    let newDate = new Date(date);

    //alt+96 => ``
    return `${newDate.getFullYear()}/${newDate.getMonth() + 1}/${newDate.getDate()}`
  }

  viewDetailSale(order: any) {
    this.is_detail_sale = true;
    this.order_selected = order;
  }

  goProfile() {
    this.is_detail_sale = false;
    this.order_selected = null;
  }

  registerAddress() {

    if (
      !this.name ||
      !this.surname ||
      !this.pais ||
      !this.address ||
      !this.region ||
      !this.ciudad ||
      !this.telefono ||
      !this.email
    ) {
      alertDanger("NECESITAS INGRESAR LOS CAMPOS OBLIGATORIOS ")
      return;
    }

    let data = {
      user: this.authEcommerceService._authService.user._id,
      name: this.name,
      surname: this.surname,
      pais: this.pais,
      address: this.address,
      referencia: this.referencia,
      region: this.region,
      ciudad: this.ciudad,
      telefono: this.telefono,
      email: this.email,
      notas: this.notas,
    }

    this.authEcommerceService.registerAddressClient(data).subscribe(
      (result: any) => {
        this.listAddressClient.push(result.address_client);
        alertSuccess(result.message);
        this.resetFormulario();
      }
    )
  }

  resetFormulario() {
    this.name = null;
    this.surname = null;
    this.pais = null;
    this.address = null;
    this.referencia = null;
    this.region = null;
    this.ciudad = null;
    this.telefono = null;
    this.email = null;
    this.notas = null;
  }

  updateAdress() {
    if (
      !this.name ||
      !this.surname ||
      !this.pais ||
      !this.address ||
      !this.region ||
      !this.ciudad ||
      !this.telefono ||
      !this.email
    ) {
      alertDanger("NECESITAS INGRESAR LOS CAMPOS OBLIGATORIOS ")
      return;
    }

    let data = {
      _id: this.address_client_selected._id,
      user: this.authEcommerceService._authService.user._id,
      name: this.name,
      surname: this.surname,
      pais: this.pais,
      address: this.address,
      referencia: this.referencia,
      region: this.region,
      ciudad: this.ciudad,
      telefono: this.telefono,
      email: this.email,
      notas: this.notas,
    }

    this.authEcommerceService.updateAddressClient(data).subscribe(
      (result: any) => {
        let INDEX = this.listAddressClient.findIndex((item: any) => item._id == this.address_client_selected._id);
        this.listAddressClient[INDEX] = result.address_client;
        alertSuccess(result.message);
      }
    )
  }

  saveAddress() {
    if (this.address_client_selected) {
      this.updateAdress();
    } else {
      this.registerAddress();
    }
  }

  addressClientSelected(address_client: any) {
    this.address_client_selected = address_client;
    this.name = this.address_client_selected.name;
    this.surname = this.address_client_selected.surname;
    this.pais = this.address_client_selected.pais;
    this.address = this.address_client_selected.address;
    this.referencia = this.address_client_selected.refencia;
    this.region = this.address_client_selected.region;
    this.ciudad = this.address_client_selected.ciudad;
    this.telefono = this.address_client_selected.telefono;
    this.email = this.address_client_selected.email;
    this.notas = this.address_client_selected.notas;
  }
  newAddress() {
    this.resetFormulario();
    this.address_client_selected = null;
  }

  updateProfileClient() {
    if (
      !this.name_c ||
      !this.surname_c ||
      !this.email_c ||
      !this.password || !this.password_repeat
    ) {
      alertDanger("TODOS LOS CAMPOS SON OBLIGATORIOS LLENARLOS")
      return;
    }

    if (this.password) {
      if (this.password != this.password_repeat) {
        alertDanger("LAS CONTRASEÑAS SON INCORRECTAS")
        return;
      }
    }

    let data = {
      _id: this.authEcommerceService._authService.user._id,
      name: this.name_c,
      surname: this.surname_c,
      email: this.email_c,
      password: this.password,
    }
    this.authEcommerceService.UpdateProfileClient(data).subscribe(
      (result: any) => {
        console.log(result);
        alertSuccess(result.message);
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user))
        }
      }
    )
  }

  viewReview(sale_detail: any) {
    this.sale_detail_selected = sale_detail;

    if (this.sale_detail_selected.review) {
      this.cantidad = this.sale_detail_selected.review.cantidad;
      this.description = this.sale_detail_selected.review.description;
    } else {
      this.cantidad = null;
      this.description = null;
    }
  }

  goDetatil() {
    this.sale_detail_selected = null;

  }

  addCantidad(valor: number) {
    this.cantidad = valor;
  }

  saveReview() {

    if(!this.cantidad || 
      !this.description){
        alertDanger("TODOS LOS CAMPOS SON OBLIGATORIOS");
        return;
    }

    let data = {
      product: this.sale_detail_selected.product._id,
      sale_detail: this.sale_detail_selected,
      user: this.authEcommerceService._authService.user._id,
      cantidad: this.cantidad,
      description: this.description,
    }

    this.authEcommerceService.regsiterReview(data).subscribe(
      (resp: any) => {
        console.log(resp);
        alertSuccess(resp.message);
        this.sale_detail_selected.review = resp.review;
      }
    )
  }

  updateReview(){
    if(!this.cantidad || 
      !this.description){
        alertDanger("TODOS LOS CAMPOS SON OBLIGATORIOS");
        return;
    }

    let data = {
      _id: this.sale_detail_selected.review._id,
      product: this.sale_detail_selected.product._id,
      sale_detail: this.sale_detail_selected,
      user: this.authEcommerceService._authService.user._id,
      cantidad: this.cantidad,
      description: this.description,
    }

    this.authEcommerceService.UpdateReview(data).subscribe(
      (resp: any) => {
        console.log(resp);
        alertSuccess(resp.message);
        this.sale_detail_selected.review = resp.review;
      }
    )
  }

  save(){
    if(this.sale_detail_selected.review){
      this.updateReview();
    }else{
      this.saveReview();
    }
  }

  logout(){
    this.authEcommerceService._authService.logout();
  }

}

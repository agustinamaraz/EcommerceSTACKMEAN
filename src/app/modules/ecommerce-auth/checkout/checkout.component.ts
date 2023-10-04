import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EcommerceAuthService } from '../_services/ecommerce-auth.service';
import { CartService } from '../../ecommerce-guest/_services/cart.service';

declare function alertDanger([]): any;
declare function alertSuccess([]): any;
declare var paypal: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @ViewChild('paypal', { static: true }) paypalElement?: ElementRef;

  listAddressClient: any = [];
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

  listCarts: any = [];
  totalCarts: any = 0;

  constructor(
    public authEcommerce: EcommerceAuthService,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.authEcommerce.listAddressClient(this.authEcommerce._authService.user._id).subscribe(
      (result: any) => {
        console.log(result)
        this.listAddressClient = result.address_client;
      }
    )

    this.cartService.currentDataCart$.subscribe(
      (result: any) => {
        console.log(result)
        this.listCarts = result;
        this.totalCarts = this.listCarts.reduce((sum: number, item: any) => sum + item.total, 0);
      }
    )

    paypal.Buttons({
      // optional styling for buttons
      // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
      style: {
        color: "gold",
        shape: "rect",
        layout: "vertical"
      },

      // set up the transaction
      createOrder: (data: any, actions: any) => {
        // pass in any options from the v2 orders create call:
        // https://developer.paypal.com/api/orders/v2/#orders-create-request-body

        if(this.listCarts.length == 0){
          alertDanger("NO SE PUEDE PROCESAR UNA ORDEN SIN NINGUN PRODUCTO DENTRO DEL CARRITO")
          return;
        }

        if(!this.address_client_selected){
          alertDanger("NECESITAS SELECCIONAR UNA DIRECCIÓN DE ENVÍO")
          return;
        }

        const createOrderPayload = {
          purchase_units: [
            {
              amount: {
                description: "COMPRAR POR EL ECOMMERCE",
                value: this.totalCarts
              }
            }
          ]
        };

        return actions.order.create(createOrderPayload);
      },

      // finalize the transaction
      onApprove: async (data: any, actions: any) => {

        let Order = await actions.order.capture();

        //console.log(Order);
        // Order.purchase_units[0].payments.captures[0].id

        let sale = {
          user: this.authEcommerce._authService.user._id,
          currency_payment: 'USD',
          method_payment: 'PAYPAL',
          n_transsaction: Order.purchase_units[0].payments.captures[0].id,
          total: this.totalCarts,
        }

        let sale_address = {
          name: this.name,
          surname: this.surname,
          pais: this.pais,
          address: this.address,
          referencia: this.referencia,
          ciudad: this.ciudad,
          region: this.region,
          telefono: this.telefono,
          email: this.email,
          notas: this.notas,
        }

        this.authEcommerce.registerSale({sale:sale,sale_address:sale_address}).subscribe(
          (result:any)=>{
            console.log(result);
            alertSuccess(result.message)
            location.reload();
          }
        )

        // return actions.order.capture().then(captureOrderHandler);
      },

      // handle unrecoverable errors
      onError: (err: any) => {
        console.error('An error prevented the buyer from checking out with PayPal');
      }
    }).render(this.paypalElement?.nativeElement);
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
      user: this.authEcommerce._authService.user._id,
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

    this.authEcommerce.registerAddressClient(data).subscribe(
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
    this.notas= this.address_client_selected.notas;
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
      user: this.authEcommerce._authService.user._id,
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

    this.authEcommerce.updateAddressClient(data).subscribe(
      (result: any) => {
        let INDEX = this.listAddressClient.findIndex((item: any) => item._id == this.address_client_selected._id);
        this.listAddressClient[INDEX] = result.address_client;
        alertSuccess(result.message);
      }
    )
  }

  save() {
    if (this.address_client_selected) {
      this.updateAdress();
    } else {
      this.registerAddress();
    }
  }

  newAddress() {
    this.resetFormulario();
    this.address_client_selected = null;
  }
}

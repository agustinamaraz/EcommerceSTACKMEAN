import { Component, OnInit } from '@angular/core';
import { EcommerceGuestService } from '../_services/ecommerce-guest.service';
import { CartService } from '../_services/cart.service';
import { Router } from '@angular/router';

declare function priceRangeSlider(): any;
declare var $: any;
declare function alertDanger([]): any;
declare function alertSuccess([]): any
declare function modalProductDetail(): any;

@Component({
  selector: 'app-filters-products',
  templateUrl: './filters-products.component.html',
  styleUrls: ['./filters-products.component.css']
})
export class FiltersProductsComponent implements OnInit {
  categories: any = [];
  variedades: any = [];
  categories_selecteds: any = [];
  is_discount: any = 1; // 1 es normal y 2 es producto con descuento
  variedad_selected: any = {
    _id: null,
  };
  products: any = [];
  product_selected: any = null;

  constructor(
    public ecommerceGuest: EcommerceGuestService,
    public cartService: CartService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.ecommerceGuest.configInitial().subscribe(
      (resp: any) => {
        console.log(resp);
        this.categories = resp.categories;
        this.variedades = resp.variedades;
      }
    )

    setTimeout(() => {
      // priceRangeSlider();
      $('#slider-range').slider({
        range: true,
        min: 0,
        max: 5000,
        values: [0, 3000],
        slide: (event:any, ui:any)=> {
          $('#amount').val('$' + ui.values[0] + '  $' + ui.values[1]);
          $('#amount-min').val(ui.values[0]);
          $('#amount-max').val(ui.values[1]);
          this.filterProducts();
        }
      });
      $('#amount').val('$' + $('#slider-range').slider('values', 0) +
        '  $' + $('#slider-range').slider('values', 1));
      $('#amount-min').val($('#slider-range').slider('values', 0));
      $('#amount-max').val($('#slider-range').slider('values', 1));
    }, 50);

    this.filterProducts();
  }

  addCategorie(categorie: any) { //pinta o despinta la tilde cuando se selecciona una categoria
    let index = this.categories_selecteds.findIndex((item: any) => item == categorie._id);
    if (index != -1) {
      this.categories_selecteds.splice(index, 1); //borra la categoria o sea la despinta
    } else {
      this.categories_selecteds.push(categorie._id); //la pinta
    }
    this.filterProducts();
  }

  selectedDiscount(value: number) {
    this.is_discount = value;
    this.filterProducts();
  }

  setVariedad(variedad: any) {
    this.variedad_selected = variedad;
    this.filterProducts();
  }

  filterProducts() {
    let data = {
      categories_selecteds: this.categories_selecteds,
      is_discount: this.is_discount,
      variedad_selected: this.variedad_selected._id ? this.variedad_selected : null,
      price_min: $("#amount-min").val(),
      price_max: $("#amount-max").val(),
    }
    this.ecommerceGuest.filterProducts(data).subscribe(
      (result: any) => {
        console.log(result)
        this.products = result.products;
      }
    )
  }

  getRouterDiscount(product: any) {
    if (product.campaing_discount) {
      return { _id: product.campaing_discount._id }
    }
    return {};
  }

  getDiscountProduct(product: any): number {

    if (product.campaing_discount) {
      if (product.campaing_discount.type_discount == 1) { //1 es porcentaje
        return product.price_usd * product.campaing_discount.discount * 0.01;
      } else { //2 es MONEDA
        return product.campaing_discount.discount;
      }
    }
    return 0;
  }

  addCart(product: any) {
    //console.log(product)
    if (!this.cartService._authService.user) {
      alertDanger("NECESITAS AUTENTICARTE PARA PODER AGREGAR EL PRODUCTO AL CARRITO")
      this.cartService._authService.logout(); //agregar modal mejor
      return;
    }

    if ($("#qty-cart").val() == 0) {
      alertDanger("NECESITAS AGREGAR UNA CANTIDAD MAYOR A 0 PARA EL CARRITO");
      return;
    }

    if (product.type_inventario == 2) { //inventario multiple


      this.router.navigateByUrl("/landing-producto/" + product.slug);
      return;
    }

    let type_discount = null;
    let discount = 0;
    let code_discount = null;


    if (product.campaing_discount) {
      type_discount = product.campaing_discount.type_discount;
      discount = product.campaing_discount.discount;
      code_discount = product.campaing_discount._id;
    }


    let data = {
      user: this.cartService._authService.user._id,
      product: product._id,
      type_discount: type_discount,
      discount: discount,
      cantidad: 1,
      variedad: null,
      code_cupon: null,
      code_discount: code_discount,
      price_unitario: product.price_usd,
      subtotal: product.price_usd - this.getDiscountProduct(product),
      total: (product.price_usd - this.getDiscountProduct(product)) * 1,
    }

    this.cartService.registerCart(data).subscribe(
      (result: any) => {
        if (result.message == 403) {
          alertDanger(result.message_text);
          return;
        } else {
          // console.log(result)
          this.cartService.changeCart(result.cart);
          alertSuccess("EL PRODUCTO SE HA AGREGADO CON EXITO AL CARRITO")
        }
      },
      (error: any) => {
        console.log(error);
        if (error.error.message = "EL TOKEN NO ES VALIDO") {
          alertDanger("debes loguearte de nuevo")
          this.cartService._authService.logout();
        }
      }
    )
  }

  openModal(product: any) {
    this.product_selected = null;

    setTimeout(() => {
      this.product_selected = product;
      //console.log("producto: ",this.product_selected)
      setTimeout(() => {
        modalProductDetail();
      }, 50);
    }, 1000);

  }

  getCalNewPrice(product: any) {
    if (product.campaing_discount) {
      if (product.campaing_discount.type_discount == 1) {
        return product.price_usd - product.price_usd * product.campaing_discount.discount * 0.01;
      } else {

        return product.price_usd - product.campaing_discount.discount;
      }
    }
    return 0;
  }
}

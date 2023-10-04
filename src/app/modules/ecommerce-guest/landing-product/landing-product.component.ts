import { Component, OnInit } from '@angular/core';
import { EcommerceGuestService } from '../_services/ecommerce-guest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../_services/cart.service';

declare var $: any;
declare function landingProductDetail(): any;
declare function modalProductDetail(): any;
declare function alertDanger([]): any;
declare function alertWarning([]): any;
declare function alertSuccess([]): any;

@Component({
  selector: 'app-landing-product',
  templateUrl: './landing-product.component.html',
  styleUrls: ['./landing-product.component.css']
})
export class LandingProductComponent implements OnInit {
  slug: any = null;
  product_selected: any = null;
  related_products: any = [];
  product_selected_modal: any = null;
  variedad_selected: any = null;

  discount_id: any = null;
  SALE_FLASH: any = null;

  REVIEWS: any = null;
  AVG_REVIEW: any = null;
  COUNT_REVIEW: any = null;

  constructor(
    public ecommerce_guest: EcommerceGuestService,
    public router: Router,
    public routerActivated: ActivatedRoute,
    public cartService: CartService,
  ) { }


  ngOnInit(): void {
    this.routerActivated.params.subscribe(
      (result: any) => {
        this.slug = result["slug"];
      })

    this.routerActivated.queryParams.subscribe(
      (result: any) => {
        this.discount_id = result["_id"];
      })

    this.ecommerce_guest.showLandingProduct(this.slug, this.discount_id).subscribe(
      (resp: any) => {
        this.product_selected = resp.product;
        this.related_products = resp.related_products;
        this.SALE_FLASH = resp.SALE_FLASH;
        this.REVIEWS = resp.REVIEW;
        this.AVG_REVIEW= resp.AVG_REVIEW;
        this.COUNT_REVIEW= resp.COUNT_REVIEW;
        console.log(resp)


        setTimeout(() => {
          landingProductDetail();
        }, 50);
      }
    )
  }

  openModal(best: any, flashSale: any = null) {
    this.product_selected_modal = null;

    setTimeout(() => {
      this.product_selected_modal = best;
      this.product_selected_modal.FlashSale = flashSale;
      //console.log("producto: ",this.product_selected)
      setTimeout(() => {
        modalProductDetail();
      }, 50);
    }, 1000);

  }

  getCalNewPrice(product: any) {
    // if(this.FlashSale.type_discount == 1){
    //   return product.price_ars - product.price_ars*this.FlashSale.discount*0.01;
    // }else{

    //   return product.price_ars - this.FlashSale.discount;
    // }
    return 0;
  }

  selectedVariedad(variedad: any) {
    // console.log(variedad)
    this.variedad_selected = variedad;
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

    if (this.product_selected.type_inventario == 2) {
      if (!this.variedad_selected) {
        alertDanger("NECESITAS SELECCIONA UNA VARIEDAD PARA EL CARRITO");
        return;
      }

      if (this.variedad_selected) {
        if (this.variedad_selected.stock < $("#qty-cart").val()) {
          alertDanger("NECESITAS AGREGAR UNA CANTIDAD MENOR PORQUE NO SE TIENE EL STOCK SUFICIENTE");
          return;
        }
      }
    }

    let data = {
      user: this.cartService._authService.user._id,
      product: this.product_selected._id,
      type_discount: this.SALE_FLASH ? this.SALE_FLASH.type_discount : null,
      discount: this.SALE_FLASH ? this.SALE_FLASH.discount : 0,
      cantidad: $("#qty-cart").val(),
      variedad: this.variedad_selected ? this.variedad_selected._id : null,
      code_cupon: null,
      code_discount: this.SALE_FLASH ? this.SALE_FLASH._id : null,
      price_unitario: this.product_selected.price_usd,
      subtotal: this.product_selected.price_usd - this.getDiscount(),
      total: (this.product_selected.price_usd - this.getDiscount()) * $("#qty-cart").val(),
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

  getDiscount(): number {
    let discount = 0;

    if (this.SALE_FLASH) {
      if (this.SALE_FLASH.type_discount == 1) {
        return this.product_selected.price_usd * (this.SALE_FLASH.discount * 0.01);
      } else {
        return this.SALE_FLASH.discount;
      }
    }

    return discount;
  }

}

import { Component } from '@angular/core';
import { HomeService } from './_services/home.service';
import { Router } from '@angular/router';
import { CartService } from '../ecommerce-guest/_services/cart.service';

declare var $: any;
declare function HOMEINITTEMPLATE([]): any;
declare function modalProductDetail(): any;
declare function alertDanger([]): any;
declare function alertSuccess([]): any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'ecommerce';
  sliders: any = [];
  categories: any = [];
  bestProducts: any = [];
  ourProducts: any = [];
  product_selected: any = null;
  FlashSale: any = null;
  FlashProductList: any = [];

  constructor(
    public homeService: HomeService,
    public router: Router,
    public cartService: CartService,
  ) {

  }

  ngOnInit(): void {

    let TIME_NOW = new Date().getTime();

    this.homeService.listHome(TIME_NOW).subscribe(
      (result: any) => {
        console.log(result);
        this.sliders = result.sliders;
        this.categories = result.categories;
        this.bestProducts = result.bestProducts;
        this.ourProducts = result.ourProducts;
        this.FlashSale = result.FlashSale;
        this.FlashProductList = result.campaign_products;
        setTimeout(() => {

          if (this.FlashSale) {
            var eventCounter = $(".sale-countdown");
            let PARSE_DATE = new Date(this.FlashSale.end_date);
            // console.log(PARSE_DATE.getMonth(),PARSE_DATE.getDate())
            let DATE = PARSE_DATE.getFullYear() + "/" + (PARSE_DATE.getMonth() + 1) + "/" + (PARSE_DATE.getDate() + 1);
            if (eventCounter.length) {
              eventCounter.countdown(DATE, function (e: any) {
                eventCounter.html(
                  e.strftime(
                    "<div class='countdown-section'><div><div class='countdown-number'>%-D</div> <div class='countdown-unit'>Day</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%H</div> <div class='countdown-unit'>Hrs</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%M</div> <div class='countdown-unit'>Min</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%S</div> <div class='countdown-unit'>Sec</div> </div></div>"
                  )
                );
              });
            }
          }
          HOMEINITTEMPLATE($);
        }, 50)
      }
    )
  }

  openModal(best: any, flashSale: any = null) {
    this.product_selected = null;

    setTimeout(() => {
      this.product_selected = best;
      this.product_selected.FlashSale = flashSale;
      //console.log("producto: ",this.product_selected)
      setTimeout(() => {
        modalProductDetail();
      }, 50);
    }, 1000);

  }

  getCalNewPrice(product: any) {
    if (this.FlashSale.type_discount == 1) {
      return product.price_usd - product.price_usd * this.FlashSale.discount * 0.01;
    } else {

      return product.price_usd - this.FlashSale.discount;
    }
  }
  getDiscountProduct(best: any, is_sale_flash:any = null): number {
    if(is_sale_flash){
      if (this.FlashSale.type_discount == 1) { //1 es porcentaje
        return best.price_usd * this.FlashSale.discount * 0.01;
      } else { //2 es MONEDA
        return this.FlashSale.discount;
      }
    }else{
      if (best.campaing_discount) {
        if (best.campaing_discount.type_discount == 1) { //1 es porcentaje
          return best.price_usd * best.campaing_discount.discount * 0.01;
        } else { //2 es MONEDA
          return best.campaing_discount.discount;
        }
      }

    }
    return 0;
  }

  getRouterDiscount(best: any) {
    if (best.campaing_discount) {
      return { _id: best.campaing_discount._id }
    }
    return {};
  }
  addCart(product: any, is_sale_flash:any = null) {
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
      let LINK_DISCOUNT = "";
      if (is_sale_flash) {
        LINK_DISCOUNT = "?_id=" + this.FlashSale._id;
      } else {
        if (product.campaing_discount) {
          LINK_DISCOUNT = "?_id=" + product.campaing_discount._id;
        }
      }
      this.router.navigateByUrl("/landing-producto/" + product.slug + LINK_DISCOUNT);
      return;
    }

    let type_discount = null;
    let discount = 0;
    let code_discount = null;

    if (is_sale_flash) {
      type_discount = this.FlashSale.type_discount;
      discount = this.FlashSale.discount;
      code_discount = this.FlashSale._id;
    } else {
      if (product.campaing_discount) {
        type_discount = product.campaing_discount.type_discount;
        discount = product.campaing_discount.discount;
        code_discount = product.campaing_discount._id;
      }
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
      subtotal: product.price_usd - this.getDiscountProduct(product,is_sale_flash),
      total: (product.price_usd - this.getDiscountProduct(product,is_sale_flash)) * 1,
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

  // showImagen(our_product:any){
  //   var IMAGEN = "";
  //   //var VAL = Math.floor(Math.random() * 3);
  //   if(our_product.galerias.length > 0){
  //     //IMAGEN = our_product.galerias[VAL].imagen;
  //     IMAGEN = our_product.galerias[2].imagen;
  //   }
  //   return IMAGEN;
  // }
}

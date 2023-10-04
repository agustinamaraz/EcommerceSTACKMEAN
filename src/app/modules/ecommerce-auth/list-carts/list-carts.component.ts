import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../ecommerce-guest/_services/cart.service';

declare function sectionCart(): any;
declare function alertDanger([]): any;
declare function alertSuccess([]): any;

@Component({
  selector: 'app-list-carts',
  templateUrl: './list-carts.component.html',
  styleUrls: ['./list-carts.component.css']
})
export class ListCartsComponent implements OnInit {
  listCarts: any = [];
  totalCarts: number = 0;
  code_cupon: any = null;

  constructor(
    public router: Router,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      sectionCart();
    }, 25);

    this.cartService.currentDataCart$.subscribe(
      (result: any) => {
        console.log(result);
        this.listCarts = result;
        this.totalCarts = this.listCarts.reduce((sum: number, item: any) => sum + item.total, 0);
      }
    )

  }

  dec(cart: any) {
    if (cart.cantidad - 1 == 0) {
      alertDanger("NO PUEDES DISMUNIR UN PRODUCTO A 0");
      return;
    }

    cart.cantidad -= 1;
    cart.subtotal = cart.price_unitario * cart.cantidad;
    cart.total = cart.price_unitario * cart.cantidad;

    let data = {
      _id: cart._id, // si o si el id siempre para updatear
      cantidad: cart.cantidad,
      subtotal: cart.subtotal,
      total: cart.total,
      variedad: cart.variedad ? cart.variedad._id : null,
      product: cart.product._id,
    }

    this.cartService.updateCart(data).subscribe(
      (result: any) => {
        console.log(result)
      }
    )
  }

  inc(cart: any) {

    if (cart.variedad) {
      if (cart.cantidad + 1 > cart.variedad.stock) {
        alertDanger("LA VARIEDAD DEL PRODUCTO NO CUENTA CON MÁS STOCK")
        return;
      }
    }

    // if(cart.cantidad + 1 > cart.product.stock){ //no hay stock asi q capaz q despues lo cambia
    //   alert("EL PRODUCTO NO CUENTA CON MÁS STOCK")
    //   return;
    // }


    cart.cantidad += 1;
    cart.subtotal = cart.price_unitario * cart.cantidad;
    cart.total = cart.price_unitario * cart.cantidad;

    let data = {
      _id: cart._id, // si o si el id siempre para updatear
      cantidad: cart.cantidad,
      subtotal: cart.subtotal,
      total: cart.total,
      variedad: cart.variedad ? cart.variedad._id : null,
      product: cart.product._id,
    }
    this.cartService.updateCart(data).subscribe(
      (result: any) => {
        console.log(result)
      }
    )
  }

  removeCart(cart: any) {
    this.cartService.deleteCart(cart._id).subscribe(
      (result: any) => {
        console.log(result);
        this.cartService.removeItemCart(cart);
      }
    )
  }

  aplicarCupon() {
    let data = {
      code: this.code_cupon,
      user_id: this.cartService._authService.user._id,
    }

    this.cartService.aplicarCupon(data).subscribe(
      (result: any) => {
        console.log(result);
        if (result.message == 403) {
          alertDanger(result.message_text);
        } else {
          alertSuccess(result.message_text);

          this.listCart();

        }
      }
    )
  }

  listCart() {
    this.cartService.resetCart();

    if (this.cartService._authService.user) {
      this.cartService.listCarts(this.cartService._authService.user._id).subscribe(
        (result: any) => {
          result.carts.forEach((cart: any) => {
            this.cartService.changeCart(cart)
          });

        }
      )
    }
  }

}

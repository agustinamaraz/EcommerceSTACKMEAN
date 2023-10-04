import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, fromEvent } from 'rxjs';
import { CartService } from 'src/app/modules/ecommerce-guest/_services/cart.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  listCarts: any = [];
  totalCarts: number = 0;
  user: any = null;
  search_product: any = null;
  products_search: any = [];

  source: any;
  @ViewChild("filter") filter?: ElementRef;

  constructor(
    public router: Router,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.user = this.cartService._authService.user;
    this.cartService.currentDataCart$.subscribe(
      (result: any) => {
        console.log(result);
        this.listCarts = result;
        this.totalCarts = this.listCarts.reduce((sum: number, item: any) => sum + item.total, 0);
      }
    )

    if (this.cartService._authService.user) {

      this.cartService.listCarts(this.cartService._authService.user._id).subscribe(
        (result: any) => {
          //console.log(result)
          // this.listCarts = result.carts;

          result.carts.forEach((cart: any) => {
            this.cartService.changeCart(cart)
          });

        }
      )
    }

  }
  ngAfterViewInit(): void { //se ejecuta despues que la vistas se haya inicializado
    this.source = fromEvent(this.filter?.nativeElement, "keyup");
    this.source.pipe(debounceTime(500)).subscribe((c: any) => { //debouncetime lo que hace es retardar 500 milisegundos cada solicitud, si lo quito no pasa nada
      let data = {
        search_product: this.search_product,
      }
      if (this.search_product.length > 1) {
        this.cartService.searchProduct(data).subscribe((resp: any) => {
          console.log(resp);
          this.products_search = resp.products;
        })
      }
    })
  }

  isHome() {
    return this.router.url == "" || this.router.url == "/" ? true : false;
  }

  logout() {
    this.cartService._authService.logout();
    this.user = null;
  }

  removeCart(cart: any) {
    this.cartService.deleteCart(cart._id).subscribe(
      (result: any) => {
        console.log(result);
        this.cartService.removeItemCart(cart);
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


 
  searchProduct() {

  }
}

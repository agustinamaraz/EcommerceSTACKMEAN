import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcommerceAuthComponent } from './ecommerce-auth.component';
import { ListCartsComponent } from './list-carts/list-carts.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProfileClientComponent } from './profile-client/profile-client.component';

const routes: Routes = [
  {
    path:'',
    component: EcommerceAuthComponent,
    children: [
      {
        path:'lista-de-carritos',
        component:ListCartsComponent
      },
      {
        path:'proceso-de-pago',
        component:CheckoutComponent
      },
      {
        path:'perfil-del-cliente',
        component:ProfileClientComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcommerceAuthRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/auth-profile/_services/auth.guard';

const routes: Routes = [
  { //ruta vacia, me redirige a otra ruta
    path:'',
    loadChildren:()=> import("./modules/home/home.module").then(m=>m.HomeModule)
  },
  { //ruta vacia, me redirige a otra ruta
    path:'',
    loadChildren:()=> import("./modules/ecommerce-guest/ecommerce-guest.module").then(m=>m.EcommerceGuestModule)
  },
  { //ruta vacia, me redirige a otra ruta
    path:'auth',
    loadChildren:()=> import("./modules/auth-profile/auth-profile.module").then(m=>m.AuthProfileModule)
  },
  { //ruta vacia, me redirige a otra ruta
    path:'',
    canActivate: [AuthGuard],
    loadChildren:()=> import("./modules/ecommerce-auth/ecommerce-auth.module").then(m=>m.EcommerceAuthModule)
  },
  //dejar las siguientes rutas de abajo de las demas
  { //ruta vacia, me redirige a otra ruta
    path:'',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {//ingresa una ruta no definida, me muestra la pagina error/404
    path: '**',
    redirectTo: 'error/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,]
})
export class AppRoutingModule { }

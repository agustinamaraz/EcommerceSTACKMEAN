import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    if (!this.authService.user || !this.authService.token) { //si no hay usuario o token en el localStorage quiere decir que no se logeo
      this.router.navigate(["auth/login"])
      return false;
    }

    //si ya esta logeado, toca verificar si el token no expiró
    let token = this.authService.token;

    //1) let expiration = token.split('.')[1] //como el token tiene 3 partes separadas por . entonces separo cada parte en un array y tomo la posicion 1 (me interesa esta parte porque posee la info que necesito de expiracion)
    //2) let expiration = atob(token.split('.')[1]) //atob lo que hace es desencriptar
    //3) let expiration = JSON.parse(atob(token.split('.')[1])) // como lo que devuelve es una cadena, necesito acceder a sus propiedades por lo que lo parseo/transformo a un json
    let expiration = JSON.parse(atob((token.split('.')[1]))).exp; // ahora puedo acceder a su propiedad exp, que da info de la fecha de expiracion del token

    if(Math.floor((new Date).getTime()/1000) >= expiration){
      this.authService.logout();
      return false;
    }

    return true;
  }

}

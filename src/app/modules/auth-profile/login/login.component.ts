import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Route, Router } from '@angular/router';

declare function alertDanger([]):any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  email!:string;
  password!:string;

  constructor(public authService: AuthService,
    public router:Router){}


  ngOnInit(): void {
    // si ya inicie sesion no me puede dejar volver al login. Lo que hace el ngOnInit es que
    //se ejecuta antes que cualquier componente, asi que si un usuario ya logeado intenta volver a la pagina de login
    //se lo redirecciona al home
    if(this.authService.user){
      this.router.navigate(["/"])
    }
  }


  login(){

    if(!this.email){
      alertDanger("ES NECESARIO INGRESAR EL EMAIL")
    }
    if(!this.password){
      alertDanger("ES NECESARIO INGRESAR EL PASSWORD")
    }

    this.authService.login(this.email,this.password).subscribe(
      (result:any) =>{
          console.log(result)

          if(!result.error && result){
            // SINGIFICA QUE EL USUARIO INGRESO CON EXITO
            // this.router.navigate(["/"])
            location.reload();
          }else{
            alertDanger(result.error.message);
          }
      },
      error =>{
        console.log(error)
      }
    )
  }
}

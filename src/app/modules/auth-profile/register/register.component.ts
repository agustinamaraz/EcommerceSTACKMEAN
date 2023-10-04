import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

declare function alertDanger([]):any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string = '';
  name: string = '';
  surname: string = '';
  password: string = '';
  repeat_password: string = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // si ya inicie sesion no me puede dejar volver al login. Lo que hace el ngOnInit es que
    //se ejecuta antes que cualquier componente, asi que si un usuario ya logeado intenta volver a la pagina de login
    //se lo redirecciona al home
    if (this.authService.user) {
      this.router.navigate(["/"])
    }
  }


  registro() {
    if (!this.email || !this.name || !this.surname || !this.password || !this.repeat_password) {
      alertDanger("todos los cambios son requeridos")
    }

    if (this.password != this.repeat_password) {
      alertDanger("las contraseñas deben ser iguales")
    }

    let data = {
      email: this.email,
      surname: this.surname,
      repeat_password: this.repeat_password,
      name: this.name,
      password: this.password,
      rol: 'cliente'
    };



    this.authService.registro(data).subscribe((resp: any) => {
      console.log(resp)
      this.router.navigate(["auth/login"])
    },
      (error: any) => {
        console.log(error)
      })
  }


}

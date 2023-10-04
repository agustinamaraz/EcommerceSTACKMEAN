import { Component, OnInit } from '@angular/core';
declare function sideOffcanvasToggle([],[]):any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {
    setTimeout(() => {
      sideOffcanvasToggle('.cart-dropdown-btn', '#cart-dropdown')
    }, 50);
  }

}

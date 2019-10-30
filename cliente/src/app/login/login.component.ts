import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nombreUsuario = '';
  password = '';
  error = '';


  constructor(private httpClient : HttpClient, private router: Router) { 

  }

  ngOnInit() {
  }

  async ingresar() {
    try {
    
      await this.httpClient.post('http://3.80.30.175/api/login', {nombreUsuario: this.nombreUsuario, password: this.password}, {withCredentials: true}).toPromise();
    
      this.router.navigateByUrl('/diario');
    }
    catch(err) {
      this.error = 'Usuario y Password incorrectos';
    }  

  }
}

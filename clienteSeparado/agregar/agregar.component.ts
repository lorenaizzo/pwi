import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})
export class AgregarComponent implements OnInit {
  @Output() onAgregue =  new EventEmitter();
  error = '';
  comida = '';
  fecha = new Date();
  alimento = '';


  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  async enviar() {
    try {
      this.error = '';

      if (this.comida == '') {
        this.error += 'Comida no puede ser vacio <br>';
      }

      let body = {
        comida: this.comida,
        fecha: this.fecha,
        //fecha: this.convertirFechaAString(this.fecha),
        alimento: this.alimento
      }

//      let nuevoDiario = await this.http.post('http://3.80.30.175/api/diario', body, {withCredentials: true}).toPromise();
      let nuevoDiario = await this.http.post('http://localhost:3000/api/diario', body, {withCredentials: true}).toPromise();

      this.onAgregue.emit('');
    }
    catch (err) {
      this.error = "error al guardar";
      console.log(this.error+err);
    }
  }


  convertirFechaAString(fecha) {

    if (typeof fecha == "string") {
      return fecha.slice(0,10)
    }

    let fechaString = (fecha.getFullYear()).toString() + '-';

    if ((this.fecha.getMonth() + 1) < 10) {
      fechaString += '0' + (fecha.getMonth() + 1).toString();
    }
    else {
      fechaString += (fecha.getMonth() + 1).toString();
    }

    if ((fecha.getDate() < 10)) {
      fechaString += '-0' + fecha.getDate().toString();
    }
    else {
      fechaString += '-' + fecha.getDate().toString();
    }
  
    return fechaString;

  }


}

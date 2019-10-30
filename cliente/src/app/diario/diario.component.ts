import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.css']
})
export class DiarioComponent implements OnInit {

  diarios: any;
  diarioCompleto: any;
  comida = '';
  fecha = new Date();
  alimento = '';
  error = '';
  submitted = false;
  fechaBusqueda = new Date();


  constructor(private http: HttpClient) {

  }


  async ngOnInit() {
    try {
      await this.cargarDiario();
      this.buscar();

    }
    catch (err) {
      this.error = "Error al iniciar";
    }

  }

  async cargarDiario() {
      let resultado: any;
      resultado = await this.http.get('http://3.80.30.175/api/diario', {withCredentials: true}).toPromise();

      resultado.sort((a, b) => {
        if (this.convertirFechaAString(b.fecha) > this.convertirFechaAString(a.fecha))
          return 1

        if (this.convertirFechaAString(b.fecha) < this.convertirFechaAString(a.fecha))
          return -1

        return 0;

      });
      this.diarioCompleto = resultado;
 
  }

  async enviar() {
    try {
      this.error = '';

      if (this.comida == '') {
        this.error += 'Comida no puede ser vacio <br>';
      }

      let body = {
        comida: this.comida,
        fecha: this.convertirFechaAString(this.fecha),
        alimento: this.alimento
      }

      let nuevoDiario = await this.http.post('http://3.80.30.175/api/diario', body, {withCredentials: true}).toPromise();

      this.diarioCompleto.push(nuevoDiario);
      this.diarios = this.diarioCompleto;
      this.buscar();
    }
    catch (err) {
      this.error = "error al guardar";
    }
  }

  buscar() {

    let comidasDelDia = [];

    this.diarioCompleto.forEach(unDiario => {
      if (this.convertirFechaAString(unDiario.fecha) == this.convertirFechaAString(this.fechaBusqueda)) {
        comidasDelDia.push(unDiario);
      }
    });

    this.diarios = comidasDelDia;


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

    if ((this.fechaBusqueda.getDate() < 10)) {
      fechaString += '-0' + fecha.getDate().toString();
    }
    else {
      fechaString += '-' + fecha.getDate().toString();
    }

    return fechaString;

  }

  async borrar(id) {
    try {
      let respuesta = await this.http.delete('http://3.80.30.175/api/diario/' + id, {withCredentials: true}).toPromise();

      this.diarioCompleto = this.diarioCompleto.filter(function (unDiario) {
        if (unDiario._id != id)
          return unDiario;
      });

      this.buscar();
    }
    catch (err) {
      this.error = "error al borrar";
    }
  }
}


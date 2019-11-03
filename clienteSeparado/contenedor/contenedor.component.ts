import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contenedor',
  templateUrl: './contenedor.component.html',
  styleUrls: ['./contenedor.component.css']
})
export class ContenedorComponent implements OnInit {
  listado: any;

  
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.recargar();
  }

  async recargar() {
    try{
      let resultado: any;
//      resultado = await this.http.get('http://3.80.30.175/api/diario', {withCredentials: true}).toPromise();
      resultado = await this.http.get('http://localhost:3000/api/diario', {withCredentials: true}).toPromise();

      resultado.sort((a, b) => {
        if (this.convertirFechaAString(b.fecha) > this.convertirFechaAString(a.fecha))
          return 1

        if (this.convertirFechaAString(b.fecha) < this.convertirFechaAString(a.fecha))
          return -1

        return 0;

      });
      this.listado = resultado;
    }
    catch(err){
      console.log("error al recargar"+err);
    }
}

convertirFechaAString(fecha) {

  if (typeof fecha == "string") {
    return fecha.slice(0,10)
  }


  let fechaString = (fecha.getFullYear()).toString() + '-';

  if ((fecha.getMonth() + 1) < 10) {
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

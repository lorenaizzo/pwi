import { Component, OnInit, Input, NgZone } from '@angular/core';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  @Input() listado;
  filtro= new Date();

  constructor(private zone: NgZone) { }

  ngOnInit() {
  }

  filtrar(filtroFecha) {
    console.log("llegue al filtrar de listado");
    this.filtro = filtroFecha;
    this.filtrarListado();
  }

  filtrarListado() {
    let comidasDelDia = [];
    console.log("filtro tiene "+this.filtro);
    this.listado.forEach(unDiario => {
      if (this.convertirFechaAString(unDiario.fecha) == this.convertirFechaAString(this.filtro)) {
        comidasDelDia.push(unDiario);
        console.log(unDiario.alimento);
      }
    });

    this.zone.run(() => {
      console.log("entre a zone");
      this.listado = comidasDelDia;
    });

    
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

    console.log(fechaString);

    return fechaString;

  }

  sacar(id) {
    this.listado = this.listado.filter(function (unaDeLista) {
      if (unaDeLista._id != id)
        console.log(unaDeLista.comida);
        return unaDeLista;
    });

    this.filtrarListado();

  }

}

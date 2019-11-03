import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {
  @Output() onBuscar = new EventEmitter();
  fechaBuscar = new Date();

  constructor() { }

  ngOnInit() {
  }

  buscar() {
    console.log("buscar");
    this.onBuscar.emit(this.fechaBuscar);
  }
}
